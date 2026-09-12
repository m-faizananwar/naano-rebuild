import type { Metadata } from "next";
import Script from "next/script";
import { EmptyState } from "@/components/page/EmptyState";
import { DemoLandingActions } from "@/features/tracking/components/demo/DemoLandingActions";
import { getDemoSite } from "@/features/tracking/server/demo-queries";

export const metadata: Metadata = { title: "Demo landing page · pixel test" };

// A stand-in for a customer's website with the naano pixel installed. Arrive
// through a tracked link (/r/{code}) and the visit + any sign-up is attributed.
export default async function DemoLandingPage({ searchParams }: { searchParams: Promise<{ site?: string }> }) {
  const { site } = await searchParams;
  const demo = await getDemoSite(site);
  if (!demo) {
    return (
      <main className="mx-auto max-w-2xl p-8">
        <EmptyState title="Demo site unavailable" body="This page needs the database (or a valid site key) to load a brand's pixel." cta={{ href: "/", label: "Back to naano" }} />
      </main>
    );
  }
  return (
    <main className="mx-auto grid max-w-5xl gap-10 px-6 py-16 lg:grid-cols-2 lg:items-center">
      <Script id="naano-queue" strategy="beforeInteractive">
        {"window.naano = window.naano || function(){ (window.naano.q = window.naano.q || []).push(arguments); };"}
      </Script>
      <Script src="/n.js" data-site={demo.siteKey} strategy="afterInteractive" />
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Demo landing page · {demo.company}</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">This is {demo.company}&apos;s website, with the naano pixel installed.</h1>
        <p className="mt-4 text-muted-foreground">
          {demo.valueProp ?? "A product page like any other."} Land here from a creator&apos;s tracked link and every action below is
          attributed to that creator — same snippet, same API as naano&apos;s.
        </p>
        <p className="mt-4 text-xs text-muted-foreground">
          Site key <code className="rounded bg-muted px-1">{demo.siteKey}</code> · script <code className="rounded bg-muted px-1">/n.js</code>
        </p>
      </div>
      <DemoLandingActions />
    </main>
  );
}
