import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');

    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError) {
      console.error('Error getting user in interview-assistant:', authError.message);
    }

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { action, jobRole, difficulty, conversationHistory, sessionData } = await req.json();
    console.log("Interview assistant:", { action, jobRole, difficulty });

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (action === "start") {
      // Generate interview questions
      const questionCounts: Record<string, number> = {
        easy: 5,
        medium: 6,
        hard: 7,
      };

      const systemPrompt = `You are an experienced technical interviewer conducting a mock interview for a ${jobRole} position. 
Generate ${questionCounts[difficulty]} interview questions of ${difficulty} difficulty level. 
Include a mix of:
- Technical skills questions
- Behavioral questions (STAR method)
- Problem-solving scenarios
- Role-specific questions

Format your response as a JSON array of question objects with this structure:
[
  {
    "question": "The interview question",
    "type": "technical | behavioral | scenario",
    "hints": ["helpful hint 1", "helpful hint 2"]
  }
]`;

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Generate interview questions for ${jobRole} at ${difficulty} level.` },
          ],
          response_format: { type: "json_object" },
          temperature: 0.8,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("AI Gateway error:", response.status, errorText);
        
        if (response.status === 429) {
          return new Response(
            JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
            { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        
        if (response.status === 402) {
          return new Response(
            JSON.stringify({ error: "Payment required. Please add credits to continue." }),
            { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        throw new Error(`AI Gateway error: ${response.status}`);
      }

      const data = await response.json();
      const content = JSON.parse(data.choices[0].message.content);

      // Update study time (assume 15 minutes for interview prep)
      await supabaseClient.rpc('upsert_daily_stats', {
        p_user_id: user.id,
        p_study_minutes: 15,
        p_courses: 0
      })
      
      return new Response(
        JSON.stringify({ questions: content }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    } else if (action === "evaluate") {
      // Evaluate answer
      const systemPrompt = `You are an experienced interviewer providing constructive feedback. 
Analyze the candidate's answer and provide:
1. Strengths (what they did well)
2. Areas for improvement
3. A rating from 1-5
4. Specific suggestions for better answers

Be encouraging but honest. Focus on helping them improve.`;

      const messages = [
        { role: "system", content: systemPrompt },
        ...conversationHistory,
      ];

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`AI Gateway error: ${response.status}`);
      }

      const data = await response.json();
      const feedback = data.choices[0].message.content;

      // Save interview session if sessionData provided
      if (sessionData) {
        const score = Math.floor(Math.random() * 30) + 70 // Simple scoring for now
        
        const { error: saveError } = await supabaseClient
          .from('interview_sessions')
          .insert({
            user_id: user.id,
            role: sessionData.role,
            difficulty: sessionData.difficulty,
            questions: sessionData.questions,
            answers: sessionData.answers,
            feedback: { summary: feedback },
            score
          })

        if (!saveError) {
          // Check achievements
          const { count } = await supabaseClient
            .from('interview_sessions')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)

          // First interview achievement
          if (count === 1) {
            const { data: achievement } = await supabaseClient
              .from('achievements')
              .select('id')
              .eq('name', 'Interview Ready')
              .maybeSingle()

            if (achievement) {
              await supabaseClient
                .from('user_achievements')
                .insert({ user_id: user.id, achievement_id: achievement.id })
            }
          }

          // Five interviews achievement
          if (count === 5) {
            const { data: achievement } = await supabaseClient
              .from('achievements')
              .select('id')
              .eq('name', 'Interview Expert')
              .maybeSingle()

            if (achievement) {
              await supabaseClient
                .from('user_achievements')
                .insert({ user_id: user.id, achievement_id: achievement.id })
            }
          }
        }
      }
      
      return new Response(
        JSON.stringify({ feedback }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in interview-assistant function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
