import Link from "next/link";
import { PublicFooter } from "@/features/public/components/nav/PublicFooter";
import { PillLink } from "@/features/public/components/shared/PillLink";

export default function NotFound() {
  return (
    <>
      <main className="flex flex-1 flex-col items-center justify-center bg-linear-to-b from-brand-soft to-background px-4 py-32 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">404</p>
        <h1 className="mt-4 text-4xl font-bold tracking-[-0.03em] sm:text-6xl">This page isn&apos;t on the marketplace.</h1>
        <p className="mt-6 max-w-md text-lg text-muted-foreground">The link may be old, or the page lives in the brand or creator workspace and needs a sign-in.</p>
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <PillLink href="/" label="Back to the landing page" />
          <Link href="/login" className="text-sm font-semibold hover:underline">
            Sign in
          </Link>
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
