import PDFParse from "pdf-parse";

const PDF_PARSE_TIMEOUT = 30000; // 30 seconds

/**
 * Parse PDF with timeout protection
 * Prevents DOS from malicious PDFs that cause infinite parsing
 */
export async function extractTextFromPdf(
  buffer: Buffer
): Promise<string> {
  try {
    // Create timeout promise that rejects after PDF_PARSE_TIMEOUT
    const timeoutPromise = new Promise<never>((_, reject) => {
      const timer = setTimeout(() => {
        reject(new Error("PDF parsing timeout"));
      }, PDF_PARSE_TIMEOUT);
      // Ensure timer cleanup
      timer.unref?.();
    });

    // Race the parser against timeout
    const data = await Promise.race([
      PDFParse(buffer),
      timeoutPromise,
    ]);

    const text = data.text;

    if (!text || !text.trim()) {
      throw new Error("El PDF no contiene texto extraíble");
    }

    return text.trim();
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);

    // Log detailed error in development only
    if (process.env.NODE_ENV === "development") {
      console.error("PDF parse error details:", errorMsg);
    }

    throw new Error(
      "No se pudo leer el PDF. Proba pegando el texto directamente."
    );
  }
}
