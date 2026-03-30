import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const AI_GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const AI_MODEL = "google/gemini-3-flash-preview";

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
    if (response.status === 429) {
      throw { status: 429, message: "Rate limit exceeded. Please try again later." };
    }
    if (response.status === 402) {
      throw { status: 402, message: "AI usage limit reached. Please add credits." };
    }
    throw new Error(`AI Gateway error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: authData, error: authError } = await supabaseClient.auth.getUser();
    const user = authData?.user ?? null;
    if (authError) console.error('Error getting user:', authError.message);

    const { contentType, topic, details, saveToLibrary } = await req.json();
    console.log("Generating content:", { contentType, topic, details, saveToLibrary });

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompts: Record<string, string> = {
      "lecture-notes": "You are an expert educator creating detailed lecture notes. Structure content with: 1) Introduction/Overview 2) Main Concepts (with definitions and explanations) 3) Key Examples 4) Important Points to Remember 5) Summary. Use clear headings, bullet points, and emphasize core concepts.",
      "roadmap": "You are a learning path designer. Create a step-by-step learning roadmap with: 1) Prerequisites 2) Beginner Level (weeks 1-4) 3) Intermediate Level (weeks 5-8) 4) Advanced Level (weeks 9-12) 5) Resources for each stage 6) Milestones and checkpoints.",
      "timetable": "You are a study schedule planner. Create a weekly timetable with: 1) Daily study sessions with specific times 2) Topics for each session 3) Break times 4) Review sessions 5) Practice/Exercise time.",
      "project": "You are a project design expert. Create a hands-on project plan with: 1) Project Goal 2) Required Tools 3) Phase 1: Setup 4) Phase 2: Core Features 5) Phase 3: Advanced Features 6) Phase 4: Testing 7) Expected Outcomes.",
      "mcqs": "You are an assessment creator. For each MCQ: 1) Topic/Concept 2) Question stem 3) Four options (A-D) 4) Correct answer 5) Detailed explanation 6) Difficulty level.",
      "research": "You are an academic research advisor. Create a research paper structure with: 1) Research Question 2) Literature Review outline 3) Methodology 4) Expected Findings 5) Discussion points 6) Conclusion 7) Suggested References.",
    };

    const prompts: Record<string, string> = {
      "lecture-notes": `Create comprehensive lecture notes for "${topic}". ${details ? `Focus on: ${details}` : "Cover all fundamental aspects."}`,
      "roadmap": `Design a complete learning roadmap for "${topic}". ${details ? `Special focus: ${details}` : "Create a 12-week plan."}`,
      "timetable": `Create a detailed weekly study timetable for "${topic}". ${details ? `Considerations: ${details}` : "Assume 2-3 hours daily."}`,
      "project": `Design a hands-on project for learning "${topic}". ${details ? `Requirements: ${details}` : "Create an intermediate-level project."}`,
      "mcqs": `Generate 10 MCQ practice questions for "${topic}". ${details ? `Focus areas: ${details}` : "Cover fundamental to advanced concepts."}`,
      "research": `Create a research paper outline for "${topic}". ${details ? `Research focus: ${details}` : "Create a comprehensive outline."}`,
    };

    const systemPrompt = systemPrompts[contentType] || "You are a helpful educational assistant.";
    const userPrompt = prompts[contentType] || `Create content about: ${topic}`;

    const content = await callAI(systemPrompt, userPrompt, LOVABLE_API_KEY);
    if (!content) throw new Error("No content generated");

    console.log("Content generated successfully");

    if (saveToLibrary && user) {
      const { error: saveError } = await supabaseClient.from('saved_content').insert({
        user_id: user.id, content_type: contentType, topic, content, metadata: { details }
      });
      if (saveError) {
        console.error('Error saving content:', saveError);
      } else {
        const { count } = await supabaseClient.from('saved_content').select('*', { count: 'exact', head: true }).eq('user_id', user.id);
        if (count === 1) {
          const { data: achievement } = await supabaseClient.from('achievements').select('id').eq('name', 'Content Creator').maybeSingle();
          if (achievement) {
            await supabaseClient.from('user_achievements').insert({ user_id: user.id, achievement_id: achievement.id });
          }
        }
      }
    } else if (saveToLibrary && !user) {
      console.warn('Save requested but no authenticated user');
    }

    if (user) {
      await supabaseClient.rpc('upsert_daily_stats', { p_user_id: user.id, p_study_minutes: 5, p_courses: 0 });
    }

    return new Response(JSON.stringify({ content }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error: any) {
    console.error("Error in generate-content:", error);
    if (error?.status === 429 || error?.status === 402) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: error.status, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
