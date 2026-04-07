import { NextResponse } from "next/server";
import { scrapeCompany } from "@/lib/scraper";
import { prisma } from "@/lib/db";

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
      await prisma.session.update({
        where: { id: sessionId },
        data: { companyData: result.content },
      });
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
