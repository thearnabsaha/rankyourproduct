import Link from "next/link";
import { CONTACT_EMAIL, X_HANDLE } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-line">
      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col items-center gap-5 text-sm text-ink-mute text-center">
        <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-ink-soft">
          <Link href="/" className="hover:text-ink transition-colors duration-[180ms]">
            Product board
          </Link>
          <Link href="/about" className="hover:text-ink transition-colors duration-[180ms]">
            About
          </Link>
          <Link href="/rules" className="hover:text-ink transition-colors duration-[180ms]">
            Ranking rules
          </Link>
        </nav>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-1.5">
          <div className="flex items-center gap-1.5">
            <span>built by</span>
            <a
              href={`https://x.com/${X_HANDLE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-ink-soft hover:text-ink underline underline-offset-4 decoration-line transition-colors duration-[180ms]"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="shrink-0"
                aria-hidden="true"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              @{X_HANDLE}
            </a>
          </div>
          <span className="hidden sm:inline font-bold mx-1 text-line">·</span>
          <div className="flex items-center">
            <span>
              email{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="hover:text-ink transition-colors duration-[180ms] underline underline-offset-4 decoration-line"
              >
                {CONTACT_EMAIL}
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
