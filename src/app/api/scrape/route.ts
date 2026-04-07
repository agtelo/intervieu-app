import { NextResponse } from "next/server";
import { scrapeCompany } from "@/lib/scraper";
import { prisma } from "@/lib/db";
import { scrapeSchema, safeParseBody } from "@/lib/validation";
import {
  handleApiError,
  validateContentType,
  createRateLimitedResponse,
  apiResponse,
  getUserId,
  validateSessionOwnership,
} from "@/lib/api-utils";

export async function POST(req: Request) {
  // Rate limiting: max 3 scrapes per IP per minute
  const rateLimitResult = createRateLimitedResponse(req, 3, 60 * 1000);
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
  const parseResult = await safeParseBody(req, scrapeSchema);
  if (!parseResult.success) {
    return apiResponse(null, parseResult.error, 400);
  }

  try {
    const { url, sessionId } = parseResult.data;
    const userId = await getUserId();

    // Validate session ownership if sessionId provided
    if (sessionId && userId) {
      const isOwner = await validateSessionOwnership(sessionId, userId);
      if (!isOwner) {
        return apiResponse(
          null,
          "No tienes acceso a esta sesión.",
          403
        );
      }
    }

    const result = await scrapeCompany(url);

    // Save to session if sessionId provided and validated
    if (sessionId && userId) {
      await prisma.session.update({
        where: { id: sessionId },
        data: { companyData: result.content },
      });
    }

    return apiResponse({
      content: result.content,
      pages: result.pages,
    });
  } catch (err) {
    return handleApiError(err, "scrape", {
      expose: "Error al scrapear el sitio web.",
    });
  }
}
