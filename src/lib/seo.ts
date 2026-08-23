import type { Metadata } from "next";
import { CONTACT_EMAIL, SITE_DOMAIN, SITE_NAME, X_HANDLE } from "@/lib/site";

export const CANONICAL_HOST = `https://www.${SITE_DOMAIN}`;
export const SITE_LOGO = `${CANONICAL_HOST}/icons/icon-512.png`;

export const SEO_TITLE = "RankYourProduct — Pay $1 to list your product or X profile";
export const SEO_DESCRIPTION =
  "RankYourProduct is a public discovery board for founders. Submit a product URL or X handle from $1; the amount you pay is the rank you get. No algorithm, no waitlist.";

export function absUrl(path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${CANONICAL_HOST}${clean === "/" ? "/" : clean}`;
}

export function pageMetadata(opts: {
  title: string;
  description: string;
  path: string;
  index?: boolean;
  ogTitle?: string;
  absoluteTitle?: boolean;
}): Metadata {
  const url = absUrl(opts.path);
  const ogTitle = opts.ogTitle || opts.title;
  const index = opts.index !== false;
  return {
    title: opts.absoluteTitle ? { absolute: opts.title } : opts.title,
    description: opts.description,
    alternates: { canonical: url },
    robots: index
      ? { index: true, follow: true }
      : {
          index: false,
          follow: false,
          nocache: true,
          googleBot: { index: false, follow: false, noimageindex: true },
        },
    openGraph: {
      title: ogTitle,
      description: opts.description,
      url,
      siteName: "RankYourProduct",
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: opts.description,
      creator: `@${X_HANDLE}`,
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${CANONICAL_HOST}/#organization`,
    name: "RankYourProduct",
    url: CANONICAL_HOST,
    logo: {
      "@type": "ImageObject",
      url: SITE_LOGO,
    },
    email: CONTACT_EMAIL,
    sameAs: [`https://x.com/${X_HANDLE}`],
    founder: {
      "@type": "Person",
      name: "Arnab Saha",
      url: `https://x.com/${X_HANDLE}`,
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${CANONICAL_HOST}/#website`,
    name: "RankYourProduct",
    alternateName: SITE_NAME,
    url: CANONICAL_HOST,
    description: SEO_DESCRIPTION,
    inLanguage: "en",
    publisher: { "@id": `${CANONICAL_HOST}/#organization` },
  };
}

export function webPageJsonLd(opts: {
  path: string;
  name: string;
  description: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${absUrl(opts.path)}#webpage`,
    url: absUrl(opts.path),
    name: opts.name,
    description: opts.description,
    isPartOf: { "@id": `${CANONICAL_HOST}/#website` },
    inLanguage: "en",
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
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

export function listingJsonLd(listing: {
  slug: string;
  canonicalUrl: string;
  domain: string;
  title: string;
  imageUrl?: string | null;
  isProfile: boolean;
  label: string;
}) {
  const pageUrl = absUrl(`/p/${listing.slug}`);
  const description =
    listing.title ||
    `${listing.label} listed on RankYourProduct, a public pay-to-rank board.`;
  if (listing.isProfile) {
    return {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      "@id": `${pageUrl}#profile`,
      url: pageUrl,
      name: `${listing.label} on RankYourProduct`,
      description,
      isPartOf: { "@id": `${CANONICAL_HOST}/#website` },
      mainEntity: {
        "@type": "Person",
        name: listing.title || listing.label,
        url: listing.canonicalUrl,
        identifier: listing.label,
        image: listing.imageUrl || undefined,
      },
    };
  }
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${pageUrl}#app`,
    name: listing.label,
    url: listing.canonicalUrl,
    sameAs: pageUrl,
    description,
    image: listing.imageUrl || SITE_LOGO,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
  };
}
