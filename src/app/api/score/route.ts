import { NextResponse } from "next/server";
import { callGroq } from "@/lib/groq";
import { buildScorePrompt } from "@/lib/prompts";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, jdText } = body;

    if (!messages || !jdText) {
      return NextResponse.json(
        { data: null, error: "Faltan datos para el scoring." },
        { status: 400 }
      );
    }

    const prompt = buildScorePrompt(messages, jdText);
    const text = await callGroq(prompt);

    if (!text) {
      throw new Error("No text response from Grok");
    }

    const score = JSON.parse(text);
    return NextResponse.json({ data: score, error: null });
  } catch (err) {
    console.error("Error scoring:", err);
    return NextResponse.json(
      { data: null, error: "Error al evaluar el simulacro." },
      { status: 500 }
    );
  }
}
