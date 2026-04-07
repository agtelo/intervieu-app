import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const session = await prisma.session.findUnique({ where: { id } });

    if (!session) {
      return NextResponse.json(
        { data: null, error: "Sesion no encontrada." },
        { status: 404 }
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

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const session = await prisma.session.findUnique({ where: { id } });

    if (!session) {
      return NextResponse.json(
        { data: null, error: "Sesion no encontrada." },
        { status: 404 }
      );
    }

    await prisma.session.delete({ where: { id } });
    return NextResponse.json({ data: { id }, error: null });
  } catch (err) {
    console.error("Error deleting session:", err);
    return NextResponse.json(
      { data: null, error: "Error al eliminar la sesion." },
      { status: 500 }
    );
  }
}
