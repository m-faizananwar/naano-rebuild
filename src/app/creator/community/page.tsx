import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page/PageHeader";
import { CountryGlobe } from "@/features/globe/components/CountryGlobe";
import { buttonVariants } from "@/components/ui/button";
import { Leaderboard } from "@/features/workspace/components/community/Leaderboard";
import { AFFILIATE_MONTHS, AFFILIATE_SHARE_PERCENT, LEADERBOARD_SIZE } from "@/features/workspace/constants";
import { getLeaderboard } from "@/features/workspace/server/overview-queries";

import { BRAND } from "@/config/brand";
export const metadata: Metadata = { title: `Community · ${BRAND.wordmark}` };

// Reads rows on every request; must never be prerendered at build time.
export const dynamic = "force-dynamic";

export default async function CreatorCommunityPage() {
  const rows = await getLeaderboard(LEADERBOARD_SIZE);
  return (
    <>
      <PageHeader
        title="Community"
        description={`Learn with other B2B creators, share what works and make your ${BRAND.name} identity visible.`}
        actions={<CountryGlobe size={320} className="-my-8 hidden lg:block" />}
      />
      <div className="grid gap-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <section className="rounded-2xl border bg-background p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{BRAND.name} creators on Slack</p>
            <h2 className="mt-1 text-xl font-semibold">The room where B2B creators get better together.</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Ask for feedback on a sponsored post, compare campaign lessons, meet creators in your language and help shape what {BRAND.name} builds next.
            </p>
            <ul className="mt-4 grid gap-1 text-sm">
              <li>✓ Get feedback before you publish</li>
              <li>✓ Share campaign tips that work</li>
              <li>✓ Talk directly with the {BRAND.name} team</li>
            </ul>
            <button type="button" disabled className="mt-4 rounded-full border px-4 py-2 text-sm font-semibold text-muted-foreground" title="The Slack workspace is not part of this build">
              Join the Slack community (not in this build)
            </button>
          </section>
          <section className="rounded-2xl border bg-background p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">LinkedIn visibility</p>
            <h2 className="mt-1 text-xl font-semibold">Turn your LinkedIn profile into an always-on Deal Link</h2>
            <p className="mt-2 text-sm text-muted-foreground">Add your creator card to LinkedIn so brands can discover your work and join {BRAND.name} through your attributed link.</p>
            <p className="mt-4 rounded-xl bg-brand/5 p-3 text-sm">
              <span className="text-2xl font-semibold">{AFFILIATE_SHARE_PERCENT}%</span> of {BRAND.name}&apos;s commission for {AFFILIATE_MONTHS} months — leave your card on your LinkedIn profile; if a brand joins {BRAND.name} through it, your reward is tracked automatically.
            </p>
            <Link href="/creator/card" className={buttonVariants({ className: "mt-4 bg-brand text-brand-foreground hover:bg-brand/90" })}>
              Publish my card →
            </Link>
          </section>
        </div>
        <Leaderboard rows={rows} />
      </div>
    </>
  );
}
