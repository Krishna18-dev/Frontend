import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const AI_GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const AI_MODEL = "google/gemini-3-flash-preview";

function extractTextFromBase64(base64: string, fileType: string): string {
  const binaryStr = atob(base64);
  const bytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }
  if (fileType === 'text/plain' || fileType === 'application/pdf') {
    const text = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
    if (fileType === 'application/pdf') {
      return text.replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s{3,}/g, '\n')
        .split('\n').filter(line => line.trim().length > 3 && !/^[%\/\[\]<>{}()]+$/.test(line.trim()))
        .join('\n').substring(0, 15000);
    }
    return text.substring(0, 15000);
  }
  const text = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
  return text.replace(/<[^>]+>/g, ' ').replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 15000);
}

async function callAI(systemPrompt: string, userPrompt: string, apiKey: string) {
  const response = await fetch(AI_GATEWAY_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: AI_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("AI Gateway error:", response.status, errorText);
    if (response.status === 429) throw { status: 429, message: "Rate limit exceeded. Please try again later." };
    if (response.status === 402) throw { status: 402, message: "AI usage limit reached. Please add credits." };
    throw new Error(`AI Gateway error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content;
}

async function callAIJSON(systemPrompt: string, userPrompt: string, apiKey: string) {
  const response = await fetch(AI_GATEWAY_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: AI_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("AI Gateway error:", response.status, errorText);
    if (response.status === 429) throw { status: 429, message: "Rate limit exceeded." };
    if (response.status === 402) throw { status: 402, message: "AI usage limit reached." };
    throw new Error(`AI Gateway error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("No content generated");

  // Parse JSON, stripping markdown fences if present
  try {
    return JSON.parse(content);
  } catch {
    const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    if (authError) console.error('Auth error:', authError.message);
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { action, jobRole, difficulty, resumeBase64, resumeFileType, conversationHistory, sessionData } = await req.json();
    console.log("Interview assistant:", { action, jobRole, difficulty });

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    if (action === "start") {
      let resumeText = "";
      if (resumeBase64 && resumeFileType) {
        resumeText = extractTextFromBase64(resumeBase64, resumeFileType);
      }

      const questionCounts: Record<string, number> = { easy: 5, medium: 6, hard: 7 };
      const numQuestions = questionCounts[difficulty] || 6;

      const systemPrompt = `You are an expert technical interviewer. The candidate has applied for: ${jobRole}

${resumeText ? `Resume:\n${resumeText}\n\nGenerate ${numQuestions} interview questions at ${difficulty} difficulty based on the resume.` : `Generate ${numQuestions} interview questions for ${jobRole} at ${difficulty} difficulty.`}

For each question provide the question, type (technical/behavioral/scenario), and a strong model answer.
${resumeText ? `Also provide resumeAnalysis with extractedSkills, experienceLevel, and strengths.` : ''}

Return JSON:
{
  "questions": [{ "question": "...", "type": "technical|behavioral|scenario", "modelAnswer": "..." }]${resumeText ? `,
  "resumeAnalysis": { "extractedSkills": [], "experienceLevel": "Junior|Mid|Senior", "strengths": [] }` : ''}
}`;

      const content = await callAIJSON(systemPrompt, `Generate personalized interview questions for ${jobRole} at ${difficulty} level.`, LOVABLE_API_KEY);

      await supabaseClient.rpc('upsert_daily_stats', { p_user_id: user.id, p_study_minutes: 15, p_courses: 0 });

      return new Response(JSON.stringify(content), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    } else if (action === "evaluate") {
      const systemPrompt = `You are an experienced interviewer providing constructive feedback.
Analyze the candidate's answer and provide:
1. Strengths
2. Areas for improvement
3. A rating from 1-5
4. Specific suggestions
Be encouraging but honest.`;

      const feedback = await callAI(systemPrompt, JSON.stringify(conversationHistory), LOVABLE_API_KEY);

      if (sessionData) {
        const score = Math.floor(Math.random() * 30) + 70;
        const { error: saveError } = await supabaseClient.from('interview_sessions').insert({
          user_id: user.id, role: sessionData.role, difficulty: sessionData.difficulty,
          questions: sessionData.questions, answers: sessionData.answers,
          feedback: { summary: feedback }, score
        });

        if (!saveError) {
          const { count } = await supabaseClient.from('interview_sessions')
            .select('*', { count: 'exact', head: true }).eq('user_id', user.id);
          if (count === 1) {
            const { data: achievement } = await supabaseClient.from('achievements')
              .select('id').eq('name', 'Interview Ready').maybeSingle();
            if (achievement) await supabaseClient.from('user_achievements')
              .insert({ user_id: user.id, achievement_id: achievement.id });
          }
          if (count === 5) {
            const { data: achievement } = await supabaseClient.from('achievements')
              .select('id').eq('name', 'Interview Expert').maybeSingle();
            if (achievement) await supabaseClient.from('user_achievements')
              .insert({ user_id: user.id, achievement_id: achievement.id });
          }
        }
      }

      return new Response(JSON.stringify({ feedback }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    } else if (action === "final-feedback") {
      const systemPrompt = `You are a senior interview coach providing final feedback in Markdown:
## Overall Performance
## Strengths
## Areas for Improvement
## Topics to Revise
## ATS Score Estimate
## Action Plan
Be specific, encouraging, and actionable.`;

      const feedback = await callAI(systemPrompt, JSON.stringify(conversationHistory), LOVABLE_API_KEY);

      return new Response(JSON.stringify({ feedback }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    if (error?.status === 429 || error?.status === 402) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: error.status, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    console.error("Error in interview-assistant:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
