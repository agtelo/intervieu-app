import { NextResponse } from "next/server";
import { extractTextFromPdf } from "@/lib/pdf-parser";
import {
  parseFileSchema,
  safeParseBody,
} from "@/lib/validation";
import {
  handleApiError,
  validateContentType,
  createRateLimitedResponse,
  apiResponse,
  getClientIp,
} from "@/lib/api-utils";

export async function POST(req: Request) {
  // Rate limiting: max 5 PDF parses per IP per minute
  const rateLimitResult = createRateLimitedResponse(req, 5, 60 * 1000);
  if (!rateLimitResult.allowed && rateLimitResult.response) {
    return rateLimitResult.response;
  }

  // Validate Content-Type
  if (!validateContentType(req)) {
    return apiResponse(
      null,
      "Invalid Content-Type. Use application/json",
      400
    );
  }

  // Parse and validate input
  const parseResult = await safeParseBody(req, parseFileSchema);
  if (!parseResult.success) {
    return apiResponse(null, parseResult.error, 400);
  }

  try {
    const { file } = parseResult.data;
    const buffer = Buffer.from(file, "base64");
    const text = await extractTextFromPdf(buffer);

    if (!text.trim()) {
      return apiResponse(
        null,
        "No se pudo extraer texto del PDF. Proba pegando el texto directamente.",
        422
      );
    }

    return apiResponse({ text });
  } catch (err) {
    return handleApiError(err, "parse-cv", {
      expose: "Error al leer el PDF. Proba pegando el texto directamente.",
    });
  }
}
