import Link from "next/link";
import { BrandWordmark } from "@/components/BrandWordmark";
import { FOOTER_COLUMNS, FOOTER_TAGLINE } from "../../constants";
import { LinkedInMark } from "../shared/LinkedInMark";

import { BRAND } from "@/config/brand";
const YEAR = 2026;

export function PublicFooter() {
  return (
    <footer className="border-t bg-linear-to-b from-background to-brand-soft">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_repeat(5,minmax(0,1fr))]">
          <div>
            <BrandWordmark />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">{FOOTER_TAGLINE}</p>
            <a
              href={`https://www.linkedin.com/company/${BRAND.wordmark}`}
              target="_blank"
              rel="noreferrer"
              aria-label={`${BRAND.wordmark} on LinkedIn`}
              className="mt-6 inline-flex size-9 items-center justify-center rounded-lg bg-foreground text-background hover:bg-foreground/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
            >
              <LinkedInMark className="size-5 bg-transparent text-base text-background" />
            </a>
          </div>
          {FOOTER_COLUMNS.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{column.heading}</h2>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-foreground/80 hover:text-foreground hover:underline">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-14 flex flex-col gap-2 border-t pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {YEAR} {BRAND.wordmark}. All rights reserved.</p>
          <p>Rebuild for demonstration · not affiliated with naano.com</p>
        </div>
      </div>
    </footer>
  );
}
