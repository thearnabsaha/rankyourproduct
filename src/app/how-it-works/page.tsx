import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd, pageMetadata, webPageJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "How RankYourProduct works",
  description:
    "List a product URL or X profile from $1. Pay a whole-dollar amount; that number is your rank on the public board. No votes, no algorithm.",
  path: "/how-it-works",
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

export default function HowItWorksPage() {
  return (
    <article className="max-w-[680px] mx-auto px-6 py-20">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Board", path: "/" },
          { name: "How it works", path: "/how-it-works" },
        ])}
      />
      <JsonLd
        data={webPageJsonLd({
          path: "/how-it-works",
          name: "How RankYourProduct works",
          description:
            "List a product or X profile from $1. Rank is the amount paid.",
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
              name: "What does rank mean?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Rank is the highest whole-dollar amount successfully paid for that URL or handle. There is no algorithm and no voting.",
              },
            },
            {
              "@type": "Question",
              name: "Can I list an X profile?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. Use @handle, x.com/you, or twitter.com/you. Those all map to one row.",
              },
            },
          ],
        }}
      />

      <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-tight text-black mb-6">
        How RankYourProduct works
      </h1>
      <p className="text-[17px] leading-8 text-black/75 mb-10">
        RankYourProduct is a public board for founders. You are not applying to
        a directory. You are not waiting on votes. You pay a whole-dollar
        amount, and that number is your place on the table.
      </p>

      <h2 className="text-2xl font-display font-semibold text-black mb-4">
        Get listed in three steps
      </h2>
      <ol className="space-y-8 mb-12">
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

      <h2 className="text-2xl font-display font-semibold text-black mb-4">
        Who it is for
      </h2>
      <p className="text-[17px] leading-8 text-black/75 mb-10">
        Indie hackers launching a tool, teams that want a public rank they can
        explain, and people who want their X profile seen next to products —
        not buried in a feed.
      </p>

      <h2 className="text-2xl font-display font-semibold text-black mb-4">
        Common questions
      </h2>
      <div className="space-y-6 mb-12">
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
            Yes. @handle, x.com/you, and twitter.com/you are the same row. See{" "}
            <Link
              href="/rules"
              className="text-[#FE4103] font-semibold hover:underline"
            >
              ranking rules
            </Link>
            .
          </p>
        </div>
      </div>

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
