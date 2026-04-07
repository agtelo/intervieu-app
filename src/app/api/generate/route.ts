import { NextResponse } from "next/server";
import { callGroq } from "@/lib/groq";
import { prisma } from "@/lib/db";
import { buildBriefingPrompt } from "@/lib/prompts";
import { getUserId, validateSessionOwnership, apiResponse, handleApiError } from "@/lib/api-utils";
import { generateSchema, safeParseBody } from "@/lib/validation";

export async function POST(req: Request) {
  try {
    // Parse and validate input
    const parseResult = await safeParseBody(req, generateSchema);
    if (!parseResult.success) {
      return apiResponse(null, parseResult.error, 400);
    }

    const { sessionId } = parseResult.data;
    const userId = await getUserId();

    if (!userId) {
      return apiResponse(null, "No autenticado.", 401);
    }

    // Validate session ownership
    const isOwner = await validateSessionOwnership(sessionId, userId);
    if (!isOwner) {
      return apiResponse(null, "No tienes acceso a esta sesión.", 403);
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return apiResponse(null, "Sesión no encontrada.", 404);
    }

    if (!session.cvText || !session.jdText) {
      return apiResponse(
        null,
        "Faltan datos de CV o JD en la sesión.",
        400
      );
    }

    const prompt = buildBriefingPrompt(
      session.cvText,
      session.jdText,
      session.companyData || "No se pudo obtener información de la empresa.",
      session.interviewerData || undefined
    );

    const text = await callGroq(prompt);

    if (!text) {
      throw new Error("No text response from Claude");
    }

    // Parse and validate JSON
    const briefing = JSON.parse(text);

    // Update session
    await prisma.session.update({
      where: { id: sessionId },
      data: {
        briefing: JSON.stringify(briefing),
        fitScore: briefing.fit?.score || null,
        status: "ready",
      },
    });

    return apiResponse(briefing);
  } catch (err) {
    return handleApiError(err, "generate", {
      expose: "Error al generar el briefing.",
    });
  }
}
