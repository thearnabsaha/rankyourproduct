const TRACKING_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "utm_id",
  "ref",
  "fbclid",
  "gclid",
  "msclkid",
  "mc_cid",
  "mc_eid",
  "affiliate_id",
  "aff_id",
  "clickid",
  "igshid",
  "si",
];

const BLOCKED_HOSTS = [
  "t.me",
  "telegram.me",
  "telegram.org",
  "wa.me",
  "chat.whatsapp.com",
  "discord.gg",
  "m.me",
  "messenger.com",
  "signal.me",
  "signal.group",
  "invite.viber.com",
  "bit.ly",
  "t.co",
  "tinyurl.com",
  "goo.gl",
  "ow.ly",
  "is.gd",
  "cutt.ly",
  "rb.gy",
];

const PATH_KEYED_HOSTS = [
  "apps.apple.com",
  "play.google.com",
  "github.com",
  "gitlab.com",
  "bitbucket.org",
  "chromewebstore.google.com",
  "chrome.google.com",
  "x.com",
  "twitter.com",
];

const HANDLE_RE = /^[A-Za-z0-9_]{1,15}$/;
const X_RESERVED = new Set([
  "home",
  "explore",
  "notifications",
  "messages",
  "i",
  "settings",
  "compose",
  "intent",
  "search",
  "login",
  "signup",
  "tos",
  "privacy",
  "about",
  "download",
  "jobs",
  "help",
  "hashtag",
  "moments",
  "share",
  "community",
  "communities",
  "premium",
  "verified",
  "following",
  "followers",
]);

export type ParsedListingUrl = {
  canonicalUrl: string;
  domain: string;
  displayUrl: string;
};

function asXListing(handle: string): ParsedListingUrl {
  const h = handle.replace(/^@/, "").toLowerCase();
  if (!HANDLE_RE.test(h) || X_RESERVED.has(h)) {
    throw new Error("That does not look like an X handle");
  }
  return {
    canonicalUrl: `https://x.com/${h}`,
    domain: "x.com",
    displayUrl: `@${h}`,
  };
}

function tryParseX(input: string): ParsedListingUrl | null {
  if (input.startsWith("@")) {
    const handle = input.slice(1);
    if (!HANDLE_RE.test(handle)) {
      throw new Error("X handles are letters, numbers, and underscores (max 15).");
    }
    return asXListing(handle);
  }

  let candidate = input;
  if (
    !/^https?:\/\//i.test(candidate) &&
    /^(www\.)?(x|twitter)\.com\//i.test(candidate)
  ) {
    candidate = `https://${candidate}`;
  }

  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, "").toLowerCase();
  if (host !== "x.com" && host !== "twitter.com") return null;

  const parts = url.pathname.split("/").filter(Boolean);
  if (parts.length === 0) return null;

  const seg = parts[0];
  if (X_RESERVED.has(seg.toLowerCase())) {
    throw new Error("That X URL is a site page, not a profile. Use @yourhandle.");
  }
  if (!HANDLE_RE.test(seg)) {
    throw new Error("That does not look like an X handle");
  }
  return asXListing(seg);
}

export function xHandleFromUrl(canonicalUrl: string): string | null {
  try {
    const url = new URL(canonicalUrl);
    const host = url.hostname.replace(/^www\./, "").toLowerCase();
    if (host !== "x.com" && host !== "twitter.com") return null;
    const seg = url.pathname.split("/").filter(Boolean)[0];
    if (!seg || !HANDLE_RE.test(seg) || X_RESERVED.has(seg.toLowerCase())) {
      return null;
    }
    return seg.toLowerCase();
  } catch {
    return null;
  }
}

export function listingLabel(canonicalUrl: string, domain?: string): string {
  const handle = xHandleFromUrl(canonicalUrl);
  if (handle) return `@${handle}`;
  return (canonicalUrl || domain || "")
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/$/, "");
}

export function listingAvatar(canonicalUrl: string, domain: string): string {
  const handle = xHandleFromUrl(canonicalUrl);
  if (handle) {
    return `https://unavatar.io/twitter/${encodeURIComponent(handle)}`;
  }
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`;
}

export function blockedReason(hostname: string, pathname: string): string | null {
  const host = hostname.toLowerCase();
  if (BLOCKED_HOSTS.some((h) => host === h || host.endsWith(`.${h}`))) {
    return "Chat, invite, and short links are refused. Use the real product site.";
  }
  if (host === "discord.com" && pathname.toLowerCase().startsWith("/invite")) {
    return "Invite links are refused. Use the real product site.";
  }
  return null;
}

export function parseListingUrl(raw: string): ParsedListingUrl {
  let input = raw.trim();
  if (!input) throw new Error("Need a product link or @handle");

  const xListing = tryParseX(input);
  if (xListing) return xListing;

  if (!/^https?:\/\//i.test(input)) input = `https://${input}`;

  let url: URL;
  try {
    url = new URL(input);
  } catch {
    throw new Error("Use a product URL (https://example.com) or an X handle (@you)");
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Use a product URL (https://example.com) or an X handle (@you)");
  }

  url.hash = "";
  for (const param of TRACKING_PARAMS) url.searchParams.delete(param);

  const blocked = blockedReason(url.hostname, url.pathname);
  if (blocked) throw new Error(blocked);

  let host = url.hostname.toLowerCase();
  if (host.startsWith("www.")) host = host.slice(4);

  let pathname = url.pathname || "/";
  if (pathname.length > 1 && pathname.endsWith("/")) pathname = pathname.slice(0, -1);

  const pathKeyed = PATH_KEYED_HOSTS.some(
    (h) => host === h || host.endsWith(`.${h}`),
  );
  if (!pathKeyed) {
    // Host-level identity for ordinary product sites.
    pathname = pathname === "/" ? "/" : pathname;
  }

  const search = url.searchParams.toString();
  const canonicalUrl = `https://${host}${pathname === "/" ? "/" : pathname}${
    search ? `?${search}` : ""
  }`;

  const displayPath = pathname === "/" ? "" : pathname;
  const displayQuery = search ? `?${search}` : "";
  const displayUrl = `${host}${displayPath}${displayQuery}`;

  return { canonicalUrl, domain: host, displayUrl };
}

export function withUtm(rawUrl: string, source: string): string {
  try {
    const url = new URL(rawUrl);
    url.searchParams.set("utm_source", source);
    return url.toString();
  } catch {
    return rawUrl;
  }
}
