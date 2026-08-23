import { ImageResponse } from "next/og";
import prisma from "@/lib/db";
import { listingLabel } from "@/lib/url";

export const alt = "RankYourProduct listing card";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function ListingOgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const listing = await prisma.listing
    .findUnique({ where: { slug: slug.toLowerCase() } })
    .catch(() => null);
  const label = listing
    ? listingLabel(listing.canonicalUrl, listing.domain)
    : "RankYourProduct";
  const bid = listing?.highestBid ?? 1;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px",
          background: "#ffffff",
          color: "#111111",
        }}
      >
        <div style={{ fontSize: 28, color: "#FE4103", fontWeight: 700 }}>
          rankyourproduct
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            marginTop: 24,
            lineHeight: 1.1,
            maxWidth: 980,
          }}
        >
          {label}
        </div>
        <div style={{ fontSize: 32, marginTop: 28, color: "#555" }}>
          Current bid ${bid} on the public board
        </div>
      </div>
    ),
    { ...size },
  );
}
