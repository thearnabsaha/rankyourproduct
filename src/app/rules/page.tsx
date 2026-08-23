import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd, pageMetadata, webPageJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Ranking rules",
  description:
    "How RankYourProduct works: list a product or X profile from $1, how the table is ordered, what URLs are allowed, and how payments claim a row.",
  path: "/rules",
});

const steps = [
  {
    n: "1",
    title: "Paste a product URL or @handle",
    body: "Use your landing page, app store link, or X profile. Tracking parameters are stripped. Chat and invite links are refused.",
  },
  {
    n: "2",
    title: "Pick a whole-dollar amount from $1",
    body: "The default is one dollar above the current leader, so you can take first place in one step. You can pay less and still appear further down.",
  },
  {
    n: "3",
    title: "Pay. The webhook writes the row",
    body: "A completed payment is what claims the rank. The thank-you page is not enough on its own. Same URL or handle again with a higher amount moves you up — you pay the new total.",
  },
];

export default function RulesPage() {
  return (
    <article className="max-w-[680px] mx-auto px-6 py-20">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Board", path: "/" },
          { name: "Rules", path: "/rules" },
        ])}
      />
      <JsonLd
        data={webPageJsonLd({
          path: "/rules",
          name: "Ranking rules",
          description:
            "How RankYourProduct works, how the table is ordered, and how payments claim a row.",
        })}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "How do I list a product on RankYourProduct?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Paste your product URL or X handle on the homepage, choose a whole-dollar amount from $1, and pay. When payment clears, you appear on the public board.",
              },
            },
            {
              "@type": "Question",
              name: "How is rank decided?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Rank is the highest whole-dollar amount successfully paid for that URL or handle. $1 is the floor. There is no algorithm and no voting.",
              },
            },
            {
              "@type": "Question",
              name: "Can I list an X profile?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. Use @handle, x.com/you, or twitter.com/you. Those all map to one row. Chat, invite, and shortened links are refused.",
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
        RankYourProduct is a public board for founders. You are not applying to
        a directory. You are not waiting on votes. You pay a whole-dollar
        amount, and that number is your place on the table.
      </p>

      <section className="mb-12">
        <h2 className="text-2xl font-display font-semibold text-black mb-4">
          Get listed in three steps
        </h2>
        <ol className="space-y-8">
          {steps.map((step) => (
            <li key={step.n}>
              <h3 className="text-lg font-semibold text-black">
                <span className="text-[#FE4103] mr-2">{step.n}.</span>
                {step.title}
              </h3>
              <p className="mt-2 text-[17px] leading-8 text-black/75">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-display font-semibold text-black mb-4">
          Who it is for
        </h2>
        <p className="text-[17px] leading-8 text-black/75">
          Indie hackers launching a tool, teams that want a public rank they can
          explain, and people who want their X profile seen next to products —
          not buried in a feed.
        </p>
      </section>

      <section className="space-y-4 mb-10">
        <h2 className="text-2xl font-display font-semibold text-black">
          Order on the table
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
          What belongs here
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

      <section className="space-y-4 mb-10">
        <h2 className="text-2xl font-display font-semibold text-black">
          Paying, and if something breaks
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

      <section className="mb-12">
        <h2 className="text-2xl font-display font-semibold text-black mb-4">
          Common questions
        </h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-black">How do I list a product?</h3>
            <p className="mt-1 text-[17px] leading-8 text-black/75">
              Open the{" "}
              <Link href="/" className="text-[#FE4103] font-semibold hover:underline">
                public product board
              </Link>
              , paste a URL or @handle, pick an amount from $1, and pay.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-black">What does rank mean?</h3>
            <p className="mt-1 text-[17px] leading-8 text-black/75">
              Rank is the highest whole-dollar amount successfully paid for that
              listing. Nothing else.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-black">Can I list an X profile?</h3>
            <p className="mt-1 text-[17px] leading-8 text-black/75">
              Yes. @handle, x.com/you, and twitter.com/you are the same row.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-black">Are bids refundable?</h3>
            <p className="mt-1 text-[17px] leading-8 text-black/75">
              No. Bids are final. If someone pays more, you slide down.
            </p>
          </div>
        </div>
      </section>

      <p className="text-[17px] leading-8 text-black/75 mb-8">
        More background is on{" "}
        <Link
          href="/about"
          className="text-[#FE4103] font-semibold hover:underline"
        >
          why RankYourProduct exists
        </Link>
        .
      </p>

      <Link
        href="/"
        className="inline-flex px-6 py-3.5 bg-[#FE4103] text-white font-medium rounded-xl hover:opacity-90"
      >
        Rank your product from $1
      </Link>
    </article>
  );
}
