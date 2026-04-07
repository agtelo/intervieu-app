import { NextResponse } from "next/server";
import { extractTextFromPdf } from "@/lib/pdf-parser";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { file } = body;

    if (!file) {
      return NextResponse.json(
        { data: null, error: "No se recibio archivo." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(file, "base64");
    const text = await extractTextFromPdf(buffer);

    if (!text.trim()) {
      return NextResponse.json(
        {
          data: null,
          error: "No se pudo extraer texto del PDF. Proba pegando el texto directamente.",
        },
        { status: 422 }
      );
    }

    return NextResponse.json({ data: { text }, error: null });
  } catch (err) {
    console.error("Error parsing PDF:", err);
    return NextResponse.json(
      {
        data: null,
        error: "Error al leer el PDF. Proba pegando el texto directamente.",
      },
      { status: 500 }
    );
  }
}
