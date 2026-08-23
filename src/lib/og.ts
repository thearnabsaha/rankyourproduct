function decodeEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, " ")
    .trim();
}

function pickMeta(html: string, key: string): string {
  const patterns = [
    new RegExp(
      `<meta[^>]+(?:property|name)=["']${key}["'][^>]+content=["']([^"']+)["']`,
      "i",
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${key}["']`,
      "i",
    ),
  ];
  for (const re of patterns) {
    const match = html.match(re);
    if (match?.[1]) return decodeEntities(match[1]);
  }
  return "";
}

export async function scrapeTitle(targetUrl: string): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(targetUrl, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; rankyourproduct/1.0; +https://rankyourproduct.lol)",
        Accept: "text/html,application/xhtml+xml",
      },
    });
    if (!res.ok) return "";
    const html = (await res.text()).slice(0, 200_000);
    const og =
      pickMeta(html, "og:description") ||
      pickMeta(html, "og:title") ||
      pickMeta(html, "description");
    if (og) return og.slice(0, 280);
    const title = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    return title?.[1] ? decodeEntities(title[1]).slice(0, 280) : "";
  } catch {
    return "";
  } finally {
    clearTimeout(timer);
  }
}
