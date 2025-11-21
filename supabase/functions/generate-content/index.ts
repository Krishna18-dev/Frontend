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

    const { data: { user } } = await supabaseClient.auth.getUser()

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { contentType, topic, details, saveToLibrary } = await req.json();
    console.log("Generating content:", { contentType, topic, details, saveToLibrary });

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompts: Record<string, string> = {
      "lecture-notes": "You are an expert educator creating comprehensive lecture notes. Format the content with clear sections, bullet points, and key takeaways.",
      "roadmap": "You are a learning advisor creating structured learning roadmaps. Include milestones, timelines, resources, and progressive steps.",
      "timetable": "You are a study planner creating realistic study schedules. Include time blocks, breaks, and balanced coverage of topics.",
      "project": "You are a project planning expert. Create detailed project outlines with phases, tasks, deliverables, and timelines.",
      "mcqs": "You are a test creator generating practice questions. Create 10 multiple-choice questions with explanations for correct answers.",
      "research": "You are an academic writing expert. Create a research paper outline with sections, key points, and suggested references.",
    };

    const userPrompts: Record<string, string> = {
      "lecture-notes": `Create comprehensive lecture notes on: ${topic}\n\nAdditional context: ${details || "None"}`,
      "roadmap": `Create a learning roadmap for: ${topic}\n\nAdditional details: ${details || "None"}`,
      "timetable": `Create a study timetable for: ${topic}\n\nAdditional details: ${details || "None"}`,
      "project": `Create a project outline for: ${topic}\n\nAdditional details: ${details || "None"}`,
      "mcqs": `Generate 10 practice MCQs on: ${topic}\n\nFocus areas: ${details || "General coverage"}`,
      "research": `Create a research paper outline on: ${topic}\n\nAdditional details: ${details || "None"}`,
    };

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompts[contentType] || "You are a helpful educational assistant." },
          { role: "user", content: userPrompts[contentType] || `Create content about: ${topic}` },
        ],
        temperature: 0.7,
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
    const content = data.choices[0].message.content;
    
    console.log("Content generated successfully");

    // Save to library if requested
    if (saveToLibrary) {
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
    }

    // Update study time statistics (assume 5 minutes per generation)
    await supabaseClient.rpc('upsert_daily_stats', {
      p_user_id: user.id,
      p_study_minutes: 5,
      p_courses: 0
    })

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
