import { NextResponse } from "next/server";
import { searchPerson } from "@/lib/person-search";
import { prisma } from "@/lib/db";
import { searchPersonSchema, safeParseBody } from "@/lib/validation";
import {
  handleApiError,
  validateContentType,
  createRateLimitedResponse,
  apiResponse,
} from "@/lib/api-utils";

export async function POST(req: Request) {
  // Rate limiting: max 5 searches per IP per minute
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
  const parseResult = await safeParseBody(req, searchPersonSchema);
  if (!parseResult.success) {
    return apiResponse(null, parseResult.error, 400);
  }

  try {
    const { email, linkedin, company, role } = parseResult.data;

    // At least one identifier required
    if (!email && !linkedin && !company && !role) {
      return apiResponse(
        null,
        "Se necesita email, LinkedIn, empresa o cargo del entrevistador.",
        400
      );
    }

    const profile = await searchPerson({ email, linkedin, company, role });

    return apiResponse({ profile });
  } catch (err) {
    return handleApiError(err, "search-person", {
      expose: "Error al buscar info del entrevistador.",
    });
  }
}
