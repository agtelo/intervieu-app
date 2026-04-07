import PDFParse from "pdf-parse";

export async function extractTextFromPdf(
  buffer: Buffer
): Promise<string> {
  try {
    const data = await PDFParse(buffer);
    const text = data.text;

    if (!text || !text.trim()) {
      throw new Error("El PDF no contiene texto extraíble");
    }

    return text.trim();
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("PDF parse error details:", errorMsg);
    throw new Error(
      "No se pudo leer el PDF. Proba pegando el texto directamente."
    );
  }
}
