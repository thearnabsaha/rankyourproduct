import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const APEX = "rankyourproduct.lol";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const host = (req.headers.get("host") || "").split(":")[0].toLowerCase();

  if (host === `www.${APEX}`) {
    url.protocol = "https:";
    url.host = APEX;
    url.port = "";
    return NextResponse.redirect(url, 308);
  }

  if (url.pathname.length > 1 && url.pathname.endsWith("/")) {
    url.pathname = url.pathname.replace(/\/+$/, "");
    return NextResponse.redirect(url, 308);
  }

  if (url.pathname.startsWith("/p/")) {
    const lower = url.pathname.toLowerCase();
    if (lower !== url.pathname) {
      url.pathname = lower;
      return NextResponse.redirect(url, 308);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sw.js|icons/|.*\\..*).*)",
  ],
};
