import { NextResponse } from "next/server";
import { callGroq } from "@/lib/groq";
import { buildScorePrompt } from "@/lib/prompts";
import { scoreSchema, safeParseBody } from "@/lib/validation";
import { apiResponse, handleApiError } from "@/lib/api-utils";

export async function POST(req: Request) {
  try {
    // Parse and validate input
    const parseResult = await safeParseBody(req, scoreSchema);
    if (!parseResult.success) {
      return apiResponse(null, parseResult.error, 400);
    }

    const { messages, jdText } = parseResult.data;

    const prompt = buildScorePrompt(messages, jdText);
    const text = await callGroq(prompt);

    if (!text) {
      throw new Error("No text response from Claude");
    }

    const score = JSON.parse(text);
    return apiResponse(score);
  } catch (err) {
    return handleApiError(err, "score", {
      expose: "Error al evaluar el simulacro.",
    });
  }
}
