import { NextResponse } from "next/server";
import { searchPerson } from "@/lib/person-search";
import { sql } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, linkedin, company, role, sessionId } = body;

    if (!email && !linkedin) {
      return NextResponse.json(
        { data: null, error: "Se necesita email o LinkedIn del entrevistador." },
        { status: 400 }
      );
    }

    const profile = await searchPerson({ email, linkedin, company, role });

    // Save to session if sessionId provided
    if (sessionId) {
      await sql`
        UPDATE "Session"
        SET "interviewerData" = ${profile}, "updatedAt" = NOW()
        WHERE id = ${sessionId}
      `;
    }

    return NextResponse.json({ data: { profile }, error: null });
  } catch (err) {
    console.error("Error searching person:", err);
    return NextResponse.json(
      { data: null, error: "Error al buscar info del entrevistador." },
      { status: 500 }
    );
  }
}
