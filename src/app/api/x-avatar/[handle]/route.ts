import { NextRequest, NextResponse } from "next/server";
import { fetchXProfile } from "@/lib/x-profile";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ handle: string }> },
) {
  const { handle } = await params;
  const clean = decodeURIComponent(handle || "").replace(/^@/, "");
  if (!/^[A-Za-z0-9_]{1,15}$/.test(clean)) {
    return NextResponse.json({ error: "Bad handle" }, { status: 400 });
  }

  const profile = await fetchXProfile(clean);
  if (!profile?.avatarUrl) {
    return NextResponse.redirect(
      "https://www.google.com/s2/favicons?domain=x.com&sz=128",
      302,
    );
  }

  try {
    const img = await fetch(profile.avatarUrl, {
      headers: { Accept: "image/*" },
    });
    if (!img.ok || !img.body) {
      return NextResponse.redirect(profile.avatarUrl, 302);
    }
    return new NextResponse(img.body, {
      headers: {
        "Content-Type": img.headers.get("content-type") || "image/jpeg",
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
    });
  } catch {
    return NextResponse.redirect(profile.avatarUrl, 302);
  }
}
