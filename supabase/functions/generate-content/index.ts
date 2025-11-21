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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { data: authData, error: authError } = await supabaseClient.auth.getUser()
    const user = authData?.user ?? null

    if (authError) {
      console.error('Error getting user in generate-content:', authError.message)
    }

    const { contentType, topic, details, saveToLibrary } = await req.json();
    console.log("Generating content:", { contentType, topic, details, saveToLibrary });

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const systemPrompts: Record<string, string> = {
      "lecture-notes": "You are an expert educator creating comprehensive lecture notes. Format the content with clear sections, bullet points, and key takeaways.",
      "roadmap": "You are a learning advisor creating structured learning roadmaps. Include milestones, timelines, resources, and progressive steps.",
      "timetable": "You are a study planner creating realistic study schedules. Include time blocks, breaks, and balanced coverage of topics.",
      "project": "You are a project planning expert. Create detailed project outlines with phases, tasks, deliverables, and timelines.",
      "mcqs": "You are a test creator generating practice questions. Create 10 multiple-choice questions with explanations for correct answers.",
      "research": "You are an academic writing expert. Create a research paper outline with sections, key points, and suggested references.",
    };

    const prompts: Record<string, string> = {
      "lecture-notes": `Create comprehensive lecture notes on: ${topic}\n\nAdditional context: ${details || "None"}`,
      "roadmap": `Create a learning roadmap for: ${topic}\n\nAdditional details: ${details || "None"}`,
      "timetable": `Create a study timetable for: ${topic}\n\nAdditional details: ${details || "None"}`,
      "project": `Create a project outline for: ${topic}\n\nAdditional details: ${details || "None"}`,
      "mcqs": `Generate 10 practice MCQs on: ${topic}\n\nFocus areas: ${details || "General coverage"}`,
      "research": `Create a research paper outline on: ${topic}\n\nAdditional details: ${details || "None"}`,
    };

    const systemInstruction = systemPrompts[contentType] || "You are a helpful educational assistant.";
    const userPrompt = prompts[contentType] || `Create content about: ${topic}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemInstruction }]
          },
          contents: [{
            parts: [{ text: userPrompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      throw new Error(`Gemini API error: ${response.status}`);
    }

    const geminiData = await response.json();
    const content = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!content) {
      throw new Error("No content generated from Gemini API");
    }
    
    console.log("Content generated successfully");

    // Save to library if requested
    if (saveToLibrary && user) {
      const { error: saveError } = await supabaseClient
        .from('saved_content')
        .insert({
          user_id: user.id,
          content_type: contentType,
          topic,
          content,
          metadata: { details }
        })

      if (saveError) {
        console.error('Error saving content:', saveError)
      } else {
        // Check if this is user's first content - award achievement
        const { count } = await supabaseClient
          .from('saved_content')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)

        if (count === 1) {
          const { data: achievement } = await supabaseClient
            .from('achievements')
            .select('id')
            .eq('name', 'Content Creator')
            .maybeSingle()

          if (achievement) {
            await supabaseClient
              .from('user_achievements')
              .insert({ user_id: user.id, achievement_id: achievement.id })
          }
        }
      }
    } else if (saveToLibrary && !user) {
      console.warn('Save to library requested but no authenticated user; skipping save')
    }

    // Update study time statistics (assume 5 minutes per generation)
    if (user) {
      await supabaseClient.rpc('upsert_daily_stats', {
        p_user_id: user.id,
        p_study_minutes: 5,
        p_courses: 0
      })
    }

    return new Response(
      JSON.stringify({ content }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in generate-content function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
