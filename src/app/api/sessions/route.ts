import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { data: null, error: "No autenticado." },
        { status: 401 }
      );
    }

    const sessions = await prisma.session.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        createdAt: true,
        status: true,
        fitScore: true,
        simulacroStatus: true,
        companyUrl: true,
      },
    });

    return NextResponse.json({ data: sessions, error: null });
  } catch (err) {
    console.error("Error fetching sessions:", err);
    return NextResponse.json(
      { data: null, error: "Error al obtener las sesiones." },
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

    const session = await prisma.session.create({
      data: {
        status: "processing",
        userId: userId || null,
        cvText,
        cvFileName,
        jdText,
        companyUrl,
        interviewerEmail: interviewerEmail || null,
        interviewerLinkedin: interviewerLinkedin || null,
        interviewerRole: interviewerRole || null,
      },
    });

    return NextResponse.json({ data: { id: session.id }, error: null });
  } catch (err) {
    console.error("Error creating session:", err);
    return NextResponse.json(
      { data: null, error: "Error al crear la sesion." },
      { status: 500 }
    );
  }
}
