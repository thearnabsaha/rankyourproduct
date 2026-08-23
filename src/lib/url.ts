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
];

export type ParsedListingUrl = {
  canonicalUrl: string;
  domain: string;
  displayUrl: string;
};

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
  if (!input) throw new Error("Need a product link");
  if (!/^https?:\/\//i.test(input)) input = `https://${input}`;

  let url: URL;
  try {
    url = new URL(input);
  } catch {
    throw new Error("That does not look like a link (try https://example.com)");
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("That does not look like a link (try https://example.com)");
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
