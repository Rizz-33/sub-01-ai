import { NextRequest } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs"; // ensure Node runtime for server-side SDK

type RequestBody = { theme?: string };

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RequestBody;
    const theme = body?.theme?.trim();
    if (!theme) {
      return new Response(JSON.stringify({ error: "Theme not provided." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Server misconfigured: missing OPENAI_API_KEY." }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const client = new OpenAI({ apiKey });

    const prompt = `Generate one concise, original motivational quote about the theme: "${theme}". Keep it under 200 characters. Do not include author attribution.`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You craft short, powerful motivational quotes." },
        { role: "user", content: prompt },
      ],
      temperature: 0.9,
      max_tokens: 120,
    });

    const text = completion.choices?.[0]?.message?.content?.trim();
    const quote = text || "Stay focused. Keep moving. Your persistence writes the future.";

    return new Response(JSON.stringify({ quote }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}


