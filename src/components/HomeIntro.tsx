import Link from "next/link";

export default function HomeIntro() {
  return (
    <section
      className="max-w-3xl mx-auto mt-8 mb-16 px-2 sm:px-0"
      aria-labelledby="what-is-rankyourproduct"
    >
      <h2
        id="what-is-rankyourproduct"
        className="text-2xl sm:text-3xl font-display font-semibold tracking-tight text-ink mb-4"
      >
        What RankYourProduct is
      </h2>
      <p className="text-[17px] leading-8 text-ink-soft mb-6">
        RankYourProduct is a public discovery board for founders. Paste a
        product URL or an X handle, pay a whole-dollar amount from $1, and that
        number is your row. There is no vote, no waitlist, and no hidden score —
        rank is the amount successfully paid.
      </p>

      <h2 className="text-2xl sm:text-3xl font-display font-semibold tracking-tight text-ink mb-4">
        Who it is for
      </h2>
      <p className="text-[17px] leading-8 text-ink-soft mb-6">
        Indie hackers launching a tool, teams that want a rank they can explain,
        and people who want an X profile seen next to products instead of buried
        in a feed. If you need someone else to approve the listing, this is the
        wrong table.
      </p>

      <h2 className="text-2xl sm:text-3xl font-display font-semibold tracking-tight text-ink mb-4">
        How to get listed
      </h2>
      <p className="text-[17px] leading-8 text-ink-soft mb-4">
        Use the form above. The default amount is one dollar above the current
        leader so you can take first place in one payment. Pay less and you
        still appear, further down. Same URL or handle again with a higher
        amount moves you up — you pay the new total, not the gap.
      </p>
      <p className="text-[17px] leading-8 text-ink-soft">
        Read the{" "}
        <Link href="/rules" className="link-accent">
          ranking rules
        </Link>
        , or{" "}
        <Link href="/about" className="link-accent">
          why this board exists
        </Link>
        .
      </p>
    </section>
  );
}
