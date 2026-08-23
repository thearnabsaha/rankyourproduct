export const SITE_NAME = "rankyourproduct";
export const SITE_DOMAIN = "rankyourproduct.lol";
export const ACCENT = "#FE4103";

export const X_HANDLE = (
  process.env.NEXT_PUBLIC_X_HANDLE || "thearnabsaha"
).replace(/^@/, "");

export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hparnab0@gmail.com";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_ENV === "production"
    ? `https://www.${SITE_DOMAIN}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000")
).replace(/\/$/, "");

export const UTM_SOURCE = "rankyourproduct";
