import { NextResponse } from "next/server";
import { searchPerson } from "@/lib/person-search";
import { prisma } from "@/lib/db";

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
      await prisma.session.update({
        where: { id: sessionId },
        data: { interviewerData: profile },
      });
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
