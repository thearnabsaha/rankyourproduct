import { CONTACT_EMAIL, SITE_DOMAIN, SITE_NAME, X_HANDLE } from "@/lib/site";

export const CANONICAL_HOST = `https://${SITE_DOMAIN}`;

export const SEO_TITLE = `${SITE_NAME} — A row on the board starts at $1`;
export const SEO_DESCRIPTION =
  "Drop in a product URL or an X @handle, pay a whole-dollar amount from $1, and that number is your place on the public table.";

export function absUrl(path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${CANONICAL_HOST}${clean === "/" ? "/" : clean}`;
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: CANONICAL_HOST,
    description: SEO_DESCRIPTION,
    inLanguage: "en",
    publisher: {
      "@type": "Person",
      name: "Arnab Saha",
      url: `https://x.com/${X_HANDLE}`,
      email: CONTACT_EMAIL,
      sameAs: [`https://x.com/${X_HANDLE}`],
    },
  };
}

export function webAppJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SITE_NAME,
    url: CANONICAL_HOST,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "1",
      priceCurrency: "USD",
      description: "Lowest amount to appear on the board",
    },
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absUrl(item.path),
    })),
  };
}
