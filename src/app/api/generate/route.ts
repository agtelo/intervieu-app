import { NextResponse } from "next/server";
import { callGroq } from "@/lib/groq";
import { sql } from "@/lib/supabase";
import { buildBriefingPrompt } from "@/lib/prompts";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json(
        { data: null, error: "Session ID requerido." },
        { status: 400 }
      );
    }

    const sessions = await sql`
      SELECT * FROM "Session" WHERE id = ${sessionId}
    `;

    const session = sessions[0];

    if (!session) {
      return NextResponse.json(
        { data: null, error: "Sesion no encontrada." },
        { status: 404 }
      );
    }

    if (!session.cvText || !session.jdText) {
      return NextResponse.json(
        { data: null, error: "Faltan datos de CV o JD en la sesion." },
        { status: 400 }
      );
    }

    const prompt = buildBriefingPrompt(
      session.cvText,
      session.jdText,
      session.companyData || "No se pudo obtener informacion de la empresa.",
      session.interviewerData || undefined
    );

    const text = await callGroq(prompt);

    if (!text) {
      throw new Error("No text response from Claude");
    }

    // Parse and validate JSON
    const briefing = JSON.parse(text);

    // Update session
    await sql`
      UPDATE "Session"
      SET
        "briefing" = ${JSON.stringify(briefing)},
        "fitScore" = ${briefing.fit?.score || null},
        status = 'ready',
        "updatedAt" = NOW()
      WHERE id = ${sessionId}
    `;

    return NextResponse.json({ data: briefing, error: null });
  } catch (err) {
    console.error("Error generating briefing:", err);

    // Try to update session status to error
    try {
      const body = await req.clone().json();
      if (body.sessionId) {
        await sql`
          UPDATE "Session"
          SET status = 'error', "updatedAt" = NOW()
          WHERE id = ${body.sessionId}
        `;
      }
    } catch {
      // ignore
    }

    return NextResponse.json(
      { data: null, error: "Error al generar el briefing." },
      { status: 500 }
    );
  }
}
