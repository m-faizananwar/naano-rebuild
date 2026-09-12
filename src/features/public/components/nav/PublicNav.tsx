import Link from "next/link";
import { BrandWordmark } from "@/components/BrandWordmark";
import { NAV_LINKS } from "../../constants";
import { MobilePublicNav } from "./MobilePublicNav";

import { BRAND } from "@/config/brand";
const PILL = "inline-flex h-10 items-center rounded-full px-5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50";
// The scroll hero's pill (docs/reference/scroll-hero-spec.md §5): 40px, 21px sides,
// 14.5px medium, ink background, hairline border, inset highlight, lifts 2px on hover.
const HERO_PILL =
  "inline-flex h-10 items-center justify-center whitespace-nowrap rounded-full border border-foreground/10 bg-foreground px-[21px] text-[14.5px] font-medium tracking-[-0.008em] text-background shadow-[inset_0_1px_0_rgba(255,255,255,0.10)] transition-[transform,background-color] duration-300 ease-[cubic-bezier(.22,.61,.36,1)] hover:-translate-y-0.5 hover:bg-black focus-visible:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground motion-reduce:transition-none motion-reduce:hover:translate-y-0";

// Top bar of every public page. Sits over the scroll hero on the landing:
// translucent paper-ish bar, so the video shows through underneath.
export function PublicNav() {
  return (
    <header className="sticky top-0 z-40 w-full bg-background/70 backdrop-blur-md supports-backdrop-filter:bg-background/50">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label={`${BRAND.wordmark} home`} className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50">
          <BrandWordmark />
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded-full px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <span className="mr-2 text-xs font-medium text-muted-foreground" aria-label="Language: English">
            EN
          </span>
          <Link href="/login" className={`${PILL} bg-background text-foreground shadow-sm ring-1 ring-border hover:bg-muted`}>
            Sign in
          </Link>
          <Link href="/register" className={HERO_PILL}>
            Sign up
          </Link>
        </div>
        <MobilePublicNav />
      </div>
    </header>
  );
}
