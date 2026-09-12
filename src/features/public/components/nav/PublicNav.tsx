import Link from "next/link";
import { NaanoWordmark } from "@/components/NaanoWordmark";
import { NAV_LINKS } from "../../constants";
import { MobilePublicNav } from "./MobilePublicNav";

const PILL = "inline-flex h-10 items-center rounded-full px-5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50";

// Top bar of every public page. Transparent so the hero sky shows through.
export function PublicNav() {
  return (
    <header className="sticky top-0 z-40 w-full bg-background/70 backdrop-blur-md supports-backdrop-filter:bg-background/50">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="naano home" className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50">
          <NaanoWordmark />
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
          <Link href="/register" className={`${PILL} bg-foreground text-background hover:bg-foreground/85`}>
            Sign up
          </Link>
        </div>
        <MobilePublicNav />
      </div>
    </header>
  );
}
