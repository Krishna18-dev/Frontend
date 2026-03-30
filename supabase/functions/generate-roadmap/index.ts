import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const AI_GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const AI_MODEL = "google/gemini-3-flash-preview";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { goal, currentLevel, timeframe } = await req.json();
    console.log("Generating roadmap for:", { goal, currentLevel, timeframe });

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are an expert learning advisor who creates personalized, structured learning roadmaps.
Create a detailed ${timeframe}-month learning roadmap. Return ONLY valid JSON with this structure:
{
  "title": "Learning Roadmap Title",
  "overview": "Brief overview (2-3 sentences)",
  "totalDuration": "${timeframe} months",
  "milestones": [
    {
      "month": 1,
      "title": "Phase Title",
      "description": "What will be learned",
      "topics": ["Topic 1", "Topic 2"],
      "projects": ["Project 1"],
      "resources": ["Resource 1"],
      "outcome": "What the learner achieves"
    }
  ],
  "weeklySchedule": {
    "hoursPerWeek": 10,
    "breakdown": { "theory": "40%", "practice": "40%", "projects": "20%" }
  },
  "skills": ["Skill 1", "Skill 2"],
  "careerPaths": ["Career 1", "Career 2"]
}`;

    const userPrompt = `Create a ${timeframe}-month learning roadmap for:
Goal: ${goal}
Current Level: ${currentLevel}
Make it practical and tailored to their level. Return ONLY valid JSON.`;

    const response = await fetch(AI_GATEWAY_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
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
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached. Please add credits." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    console.log("Generated roadmap successfully");

    // Try to parse as JSON, stripping markdown fences if present
    let parsedContent;
    try {
      parsedContent = JSON.parse(content);
    } catch {
      const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsedContent = JSON.parse(cleaned);
    }

    return new Response(
      JSON.stringify({ roadmap: parsedContent }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-roadmap:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
