import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL, X_HANDLE } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import { absUrl, breadcrumbJsonLd, CANONICAL_HOST, pageMetadata, webPageJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About RankYourProduct",
  description:
    "Why RankYourProduct exists: a public table where a product or X profile's place is the amount paid, starting at $1. No algorithm, no waitlist.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <article className="max-w-[680px] mx-auto px-6 py-20">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Board", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
      <JsonLd
        data={webPageJsonLd({
          path: "/about",
          name: "About RankYourProduct",
          description:
            "A public table where a product's place is the amount paid, starting at $1.",
        })}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "About RankYourProduct",
          url: absUrl("/about"),
          isPartOf: { "@id": `${CANONICAL_HOST}/#website` },
        }}
      />
      <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-tight text-black mb-6">
        Visibility should not depend on a secret score.
      </h1>
      <div className="space-y-5 text-[17px] leading-8 text-black/75">
        <p>
          Builders ship tools every day that never get a real look. Feeds hide
          them. Search is a guessing game. Most directories sit behind a
          reviewer with a form.
        </p>
        <p>
          <strong className="text-black">RankYourProduct</strong> is a single
          public table. Drop a product URL or an X @handle, name a whole-dollar
          amount from $1, pay, and that number is your place. Higher number,
          higher row. Lower number, you still show up — just further down.
        </p>
        <h2 className="text-2xl font-display font-semibold text-black pt-6">
          One number. No backstage.
        </h2>
        <p>
          Nobody curates the order. There is no vote, no waitlist, and no
          “for you” ranking. Clicks and fresh payments sit next to the table
          so you can see the room moving.
        </p>
        <p>
          Same URL again with a larger amount moves you up. You pay the new
          total, not a leftover. Rows stay until someone spends more.
        </p>
        <p>
          New here? Start with{" "}
          <Link
            href="/how-it-works"
            className="text-[#FE4103] font-semibold hover:underline"
          >
            how listing and rank work
          </Link>{" "}
          or the{" "}
          <Link
            href="/rules"
            className="text-[#FE4103] font-semibold hover:underline"
          >
            ranking rules
          </Link>
          .
        </p>
        <p className="font-medium text-black pt-4">Want a row?</p>
        <p>
          Head to the{" "}
          <Link href="/" className="text-[#FE4103] font-semibold hover:underline">
            public product board
          </Link>{" "}
          and put a number on your link.
        </p>

        <h2 className="text-2xl font-display font-semibold text-black pt-6">
          Who runs this
        </h2>
        <p>
          Built and run by{" "}
          <a
            href={`https://x.com/${X_HANDLE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#FE4103] font-semibold hover:underline"
          >
            @{X_HANDLE}
          </a>
          . Questions, payment issues, or anything else — email{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-[#FE4103] font-semibold hover:underline"
          >
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </div>
    </article>
  );
}
