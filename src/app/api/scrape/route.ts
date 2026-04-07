import { NextResponse } from "next/server";
import { scrapeCompany } from "@/lib/scraper";
import { sql } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url, sessionId } = body;

    if (!url) {
      return NextResponse.json(
        { data: null, error: "URL requerida." },
        { status: 400 }
      );
    }

    const result = await scrapeCompany(url);

    // Save to session if sessionId provided
    if (sessionId) {
      await sql`
        UPDATE "Session"
        SET "companyData" = ${result.content}, "updatedAt" = NOW()
        WHERE id = ${sessionId}
      `;
    }

    return NextResponse.json({
      data: { content: result.content, pages: result.pages },
      error: null,
    });
  } catch (err) {
    console.error("Error scraping:", err);
    return NextResponse.json(
      { data: null, error: "Error al scrapear el sitio web." },
      { status: 500 }
    );
  }
}
