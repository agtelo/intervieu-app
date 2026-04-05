import * as cheerio from "cheerio";

export async function scrapeUrl(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) return "";

    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove scripts, styles, navs, footers
    $("script, style, nav, footer, header, noscript, iframe, svg").remove();

    // Extract meaningful text
    const title = $("title").text().trim();
    const metaDescription =
      $('meta[name="description"]').attr("content") || "";
    const h1 = $("h1")
      .map((_, el) => $(el).text().trim())
      .get()
      .join(" | ");
    const h2 = $("h2")
      .map((_, el) => $(el).text().trim())
      .get()
      .join(" | ");

    const bodyText = $("main, article, [role='main'], .content, #content, body")
      .first()
      .text()
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 5000);

    return [
      `Title: ${title}`,
      metaDescription && `Description: ${metaDescription}`,
      h1 && `H1: ${h1}`,
      h2 && `H2: ${h2}`,
      `Content: ${bodyText}`,
    ]
      .filter(Boolean)
      .join("\n");
  } catch {
    return "";
  }
}

export async function scrapeCompany(
  baseUrl: string
): Promise<{ content: string; pages: string[] }> {
  // Normalize URL
  const url = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const pagesToTry = [url, `${url}/about`, `${url}/about-us`, `${url}/pricing`];
  const results: string[] = [];
  const scrapedPages: string[] = [];

  const scrapePromises = pagesToTry.map(async (pageUrl) => {
    const content = await scrapeUrl(pageUrl);
    if (content) {
      return { url: pageUrl, content };
    }
    return null;
  });

  const settled = await Promise.allSettled(scrapePromises);
  for (const result of settled) {
    if (result.status === "fulfilled" && result.value) {
      results.push(`--- ${result.value.url} ---\n${result.value.content}`);
      scrapedPages.push(result.value.url);
    }
  }

  return {
    content: results.join("\n\n") || "No se pudo obtener contenido del sitio.",
    pages: scrapedPages,
  };
}
