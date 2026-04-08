import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    const sessions = await db`
      SELECT * FROM "Session" WHERE id = ${id}
    `;

    const session = sessions[0];

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

    const sessions = await db`
      SELECT * FROM "Session" WHERE id = ${id}
    `;

    const session = sessions[0];

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

    await db`
      UPDATE "Session"
      SET
        "chatMessages" = ${JSON.stringify(chatMessages)},
        "simulacroScore" = ${JSON.stringify(simulacroScore)},
        "simulacroStatus" = 'completed',
        "updatedAt" = NOW()
      WHERE id = ${id}
    `;

    return NextResponse.json({ data: { id }, error: null });
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
    const { userId } = await auth();
    const { id } = await params;

    const sessions = await db`
      SELECT * FROM "Session" WHERE id = ${id}
    `;

    const session = sessions[0];

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

    await db`DELETE FROM "Session" WHERE id = ${id}`;
    return NextResponse.json({ data: { id }, error: null });
  } catch (err) {
    console.error("Error deleting session:", err);
    return NextResponse.json(
      { data: null, error: "Error al eliminar la sesion." },
      { status: 500 }
    );
  }
}
