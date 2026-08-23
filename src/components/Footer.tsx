import { CONTACT_EMAIL, X_HANDLE } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-foreground/10">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-1.5 text-sm text-foreground/50 text-center">
        <div className="flex items-center gap-1.5">
          <span>built by</span>
          <a
            href={`https://x.com/${X_HANDLE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-foreground/70 hover:text-foreground underline underline-offset-4 decoration-foreground/30 transition-colors"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="shrink-0"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            @{X_HANDLE}
          </a>
        </div>
        <span className="hidden sm:inline font-bold mx-1">·</span>
        <div className="flex items-center">
          <span>
            email{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="hover:text-foreground transition-colors underline underline-offset-4 decoration-foreground/30"
            >
              {CONTACT_EMAIL}
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
