import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/page/PageHeader";
import { getViewer } from "@/features/auth/server/session";
import { CopyLinkButton } from "@/features/workspace/components/CopyLinkButton";
import { AFFILIATE_MONTHS, AFFILIATE_SHARE_PERCENT } from "@/features/workspace/constants";

export const metadata: Metadata = { title: "Affiliate program · naano" };

export default async function CreatorAffiliatePage() {
  const viewer = await getViewer();
  if (!viewer?.creator) redirect("/login");
  const h = await headers();
  const origin = `${h.get("x-forwarded-proto") ?? "http"}://${h.get("host") ?? "localhost:3000"}`;
  const link = `${origin}/register/brand?ref=${viewer.creator.handle}`;
  return (
    <>
      <PageHeader
        eyebrow={`Creator affiliation · ${AFFILIATE_SHARE_PERCENT}% for ${AFFILIATE_MONTHS} months`}
        title="Recommend Naano. Earn for 3 months."
        description={`Share your personal link with a company. If it joins Naano and launches paid campaigns, you receive ${AFFILIATE_SHARE_PERCENT}% of Naano's commission for three months.`}
      />
      <div className="grid gap-4">
        <section className="grid gap-4 rounded-2xl border bg-background p-5 lg:grid-cols-2">
          <div>
            <h2 className="font-semibold">Introduce a company to Naano</h2>
            <p className="text-sm text-muted-foreground">Your link identifies you automatically.</p>
            <p className="mt-3 rounded-lg border bg-muted/40 px-3 py-2 font-mono text-xs">{link}</p>
            <div className="mt-3">
              <CopyLinkButton value={link} label="Copy my referral link" />
            </div>
          </div>
          <div className="rounded-xl bg-brand/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Your share of Naano&apos;s commission</p>
            <p className="text-3xl font-semibold">{AFFILIATE_SHARE_PERCENT}%</p>
            <p className="text-sm text-muted-foreground">Reward period · {AFFILIATE_MONTHS} months</p>
            <p className="mt-2 text-xs text-muted-foreground">The three-month reward period starts after the company&apos;s first completed paid campaign.</p>
          </div>
        </section>
        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border bg-background p-5"><p className="text-xs text-muted-foreground">Rewards earned</p><p className="text-2xl font-semibold">€0.00</p></div>
          <div className="rounded-2xl border bg-background p-5"><p className="text-xs text-muted-foreground">Brands introduced</p><p className="text-2xl font-semibold">0</p><p className="text-xs text-muted-foreground">0 have generated rewards</p></div>
          <div className="rounded-2xl border bg-background p-5"><p className="text-xs text-muted-foreground">Earning now</p><p className="text-2xl font-semibold">0</p><p className="text-xs text-muted-foreground">Inside the three-month window</p></div>
        </section>
        <p className="text-xs text-muted-foreground">Referral attribution (the ?ref= on sign-up) is not stored in this build, so these counters stay at zero honestly.</p>
      </div>
    </>
  );
}
