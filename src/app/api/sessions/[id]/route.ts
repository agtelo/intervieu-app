import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    const session = await prisma.session.findUnique({ where: { id } });

    if (!session) {
      return NextResponse.json(
        { data: null, error: "Sesion no encontrada." },
        { status: 404 }
      );
    }

    // Verify that the session belongs to the authenticated user
    if (session.userId && session.userId !== userId) {
      return NextResponse.json(
        { data: null, error: "No tienes acceso a esta sesion." },
        { status: 403 }
      );
    }

    return NextResponse.json({ data: session, error: null });
  } catch (err) {
    console.error("Error fetching session:", err);
    return NextResponse.json(
      { data: null, error: "Error al obtener la sesion." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;
    const body = await req.json();
    const { chatMessages, simulacroScore } = body;

    const session = await prisma.session.findUnique({ where: { id } });

    if (!session) {
      return NextResponse.json(
        { data: null, error: "Sesion no encontrada." },
        { status: 404 }
      );
    }

    // Verify that the session belongs to the authenticated user
    if (session.userId && session.userId !== userId) {
      return NextResponse.json(
        { data: null, error: "No tienes acceso a esta sesion." },
        { status: 403 }
      );
    }

    const updated = await prisma.session.update({
      where: { id },
      data: {
        chatMessages: JSON.stringify(chatMessages),
        simulacroScore: JSON.stringify(simulacroScore),
        simulacroStatus: "completed",
      },
    });

    return NextResponse.json({ data: { id: updated.id }, error: null });
  } catch (err) {
    console.error("Error updating session:", err);
    return NextResponse.json(
      { data: null, error: "Error al actualizar la sesion." },
      { status: 500 }
    );
  }
}
