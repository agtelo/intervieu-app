import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { data: null, error: "No autenticado." },
        { status: 401 }
      );
    }

    const sessions = await db`
      SELECT
        id,
        name,
        "createdAt",
        status,
        "fitScore",
        "simulacroStatus",
        "companyUrl"
      FROM "Session"
      WHERE "userId" = ${userId}
      ORDER BY "createdAt" DESC
    `;

    return NextResponse.json({ data: sessions, error: null });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Error fetching sessions:", message, err);
    return NextResponse.json(
      { data: null, error: `Error al obtener las sesiones: ${message}` },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    const body = await req.json();
    const {
      cvText,
      cvFileName,
      jdText,
      companyUrl,
      interviewerEmail,
      interviewerLinkedin,
      interviewerRole,
    } = body;

    if (!cvText || !jdText || !companyUrl) {
      return NextResponse.json(
        { data: null, error: "Faltan datos obligatorios (CV, JD, URL)." },
        { status: 400 }
      );
    }

    const id = crypto.randomUUID();

    await db`
      INSERT INTO "Session" (
        id,
        status,
        "userId",
        "cvText",
        "cvFileName",
        "jdText",
        "companyUrl",
        "interviewerEmail",
        "interviewerLinkedin",
        "interviewerRole",
        "createdAt",
        "updatedAt"
      ) VALUES (
        ${id},
        'processing',
        ${userId || null},
        ${cvText},
        ${cvFileName},
        ${jdText},
        ${companyUrl},
        ${interviewerEmail || null},
        ${interviewerLinkedin || null},
        ${interviewerRole || null},
        NOW(),
        NOW()
      )
    `;

    return NextResponse.json({ data: { id }, error: null });
  } catch (err) {
    console.error("Error creating session:", err);
    return NextResponse.json(
      { data: null, error: "Error al crear la sesion." },
      { status: 500 }
    );
  }
}
