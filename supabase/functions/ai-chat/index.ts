import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const AI_GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const AI_MODEL = "google/gemini-3-flash-preview";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function callAIWithRetry(messages: Array<{ role: string; content: string }>, apiKey: string, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const response = await fetch(AI_GATEWAY_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model: AI_MODEL, messages }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.choices?.[0]?.message?.content;
    }

    if (response.status === 429) {
      if (attempt < retries) {
        await sleep(1500 * (attempt + 1));
        continue;
      }
      throw { status: 429, message: "The AI service is busy right now. Please wait a moment and try again." };
    }

    if (response.status === 402) {
      throw { status: 402, message: "AI usage limit reached. Please add credits to your workspace." };
    }

    const errorText = await response.text();
    console.error("AI Gateway error:", response.status, errorText);
    throw new Error(`AI Gateway error: ${response.status}`);
  }
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

    const { data: authData } = await supabaseClient.auth.getUser();
    const user = authData?.user ?? null;

    const { messages } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are an AI Study Mentor — a friendly, knowledgeable, and encouraging learning companion. Your role is to help students understand concepts, solve problems, and improve their study skills.

Guidelines:
- Be conversational yet educational
- Break down complex topics into simple explanations
- Use examples, analogies, and real-world connections
- Encourage critical thinking
- Suggest study techniques when appropriate
- Use markdown formatting for better readability
- Include code examples with syntax highlighting when relevant
- Be supportive and motivating`;

    const aiMessages = [
      { role: "system", content: systemPrompt },
      ...messages,
    ];

    const content = await callAIWithRetry(aiMessages, LOVABLE_API_KEY);
    if (!content) throw new Error("No content generated");

    if (user) {
      await supabaseClient.rpc('upsert_daily_stats', { p_user_id: user.id, p_study_minutes: 5, p_courses: 0 });
    }

    return new Response(
      JSON.stringify({ content }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in ai-chat function:", error);
    if (error?.status === 429 || error?.status === 402) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: error.status, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
