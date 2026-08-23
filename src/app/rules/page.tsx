import type { Metadata } from "next";
import { CONTACT_EMAIL } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import { absUrl, breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Rules",
  description:
    "How rankyourproduct orders the table, what URLs are allowed, and how payments claim a row.",
  alternates: { canonical: "/rules" },
  openGraph: {
    title: "Rules — rankyourproduct",
    description:
      "How the table is ordered, what URLs are allowed, and how payments claim a row.",
    url: absUrl("/rules"),
    type: "website",
  },
};

export default function RulesPage() {
  return (
    <div className="max-w-[680px] mx-auto px-6 py-20">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Rules", path: "/rules" },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "How is rank decided?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "The place you sit is the largest whole-dollar amount you have actually paid. $1 is the floor.",
              },
            },
            {
              "@type": "Question",
              name: "What can I list?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "A product site, startup page, portfolio URL, or an X @handle. Chat, invite, and shortened links are refused.",
              },
            },
            {
              "@type": "Question",
              name: "Are bids refundable?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "No. Bids are final. If someone pays more, you slide down.",
              },
            },
          ],
        }}
      />
      <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-tight text-black mb-6">
        How this board works
      </h1>
      <p className="text-[17px] leading-8 text-black/75 mb-10">
        rankyourproduct is an open table of product URLs and X profiles. The
        place you sit is the largest amount you have actually paid. That is the
        whole ranking.
      </p>

      <section className="space-y-4 mb-10">
        <h2 className="text-2xl font-display font-semibold text-black">
          1. Order on the table
        </h2>
        <ul className="list-disc pl-5 space-y-3 text-[17px] leading-8 text-black/75">
          <li>
            Amounts are whole US dollars. The cheapest way onto the table is{" "}
            <strong className="text-black">$1</strong>.
          </li>
          <li>
            A bid under the current leader still goes live. You land wherever
            that number fits.
          </li>
          <li>
            Two listings at the same dollar amount: the one that arrived first
            keeps the better row.
          </li>
          <li>
            To climb, submit the same URL or @handle with a larger amount. You pay that{" "}
            <strong className="text-black">new total in full</strong>, not the
            gap.
          </li>
          <li>
            Rows do not time out. If someone spends more, you slide down. Money
            already paid is not returned.
          </li>
        </ul>
      </section>

      <section className="space-y-4 mb-10">
        <h2 className="text-2xl font-display font-semibold text-black">
          2. What belongs here
        </h2>
        <ul className="list-disc pl-5 space-y-3 text-[17px] leading-8 text-black/75">
          <li>
            A product site, a startup page, a portfolio URL, or an X profile
            (@handle, x.com/you, or twitter.com/you).
          </li>
          <li>
            Group chats and invite links are refused (Telegram, WhatsApp,
            Discord, Messenger, Signal, and the like).
          </li>
          <li>Shortened links are refused. Use the real destination.</li>
          <li>
            One cleaned URL or handle is one row. Tracking junk is stripped.
            The same X handle from @you, x.com/you, and twitter.com/you share a
            row. App Store, Play Store, and GitHub listings use the full path,
            so two apps never share a seat.
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-display font-semibold text-black">
          3. Paying, and if something breaks
        </h2>
        <ul className="list-disc pl-5 space-y-3 text-[17px] leading-8 text-black/75">
          <li>
            The row updates when the payment actually clears — not just when
            the browser comes back to this site.
          </li>
          <li>Bids are final. No refunds.</li>
          <li>
            The table is live. A larger payment from someone else can pass you
            at any moment.
          </li>
          <li>
            If a successful charge never shows up, write to{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-[#FE4103] font-semibold hover:underline"
            >
              {CONTACT_EMAIL}
            </a>{" "}
            before you open a card dispute.
          </li>
        </ul>
      </section>
    </div>
  );
}
