"use client";

import { UTM_SOURCE } from "@/lib/site";
import { withUtm } from "@/lib/url";

export default function VisitListing({
  listingId,
  url,
  domain,
  label,
}: {
  listingId: string;
  url: string;
  domain: string;
  label: string;
}) {
  const href = withUtm(url, UTM_SOURCE);

  const record = () => {
    fetch("/api/clicks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId, url, domain }),
    }).catch(() => {});
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={record}
      className="btn-primary px-6 py-3.5"
    >
      Visit {label}
    </a>
  );
}
