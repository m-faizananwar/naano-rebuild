import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/page/PageHeader";
import { buttonVariants } from "@/components/ui/button";
import { getViewer } from "@/features/auth/server/session";
import { BrandPriorityActions } from "@/features/workspace/components/overview/BrandPriorityActions";
import { NewCreatorsList } from "@/features/workspace/components/overview/NewCreatorsList";
import { StatTile } from "@/features/workspace/components/overview/StatTile";
import { getBrandOverview } from "@/features/workspace/server/overview-queries";

export const metadata: Metadata = { title: "Overview · naano" };

export default async function BrandOverviewPage() {
  const viewer = await getViewer();
  if (!viewer?.brand) redirect("/login");
  const overview = await getBrandOverview(viewer.brand.id);
  return (
    <>
      <PageHeader
        title={`Hello ${viewer.firstName} 👋`}
        description={`Here is what is happening for ${viewer.brand.company} on Naano.`}
        actions={
          <Link href="/brand/campaigns/new" className={buttonVariants()}>
            New campaign
          </Link>
        }
      />
      <div className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatTile label="Creators activated" value={String(overview.creatorsActivated)} hint="Accepted bookings and beyond" />
          <StatTile label="Posts published" value={String(overview.postsPublished)} hint="Live and paid collaborations" />
          <StatTile label="Profiles engaged" value={String(overview.profilesEngaged)} hint="Distinct visitors seen by the pixel" />
          <StatTile label="Impressions" value={overview.impressions.toLocaleString("en-US")} hint="Est. from creators' median views" />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <BrandPriorityActions overview={overview} walletCents={viewer.brand.walletCents} />
          <NewCreatorsList creators={overview.newCreators} campaignId={overview.activeCampaign?.id ?? null} />
        </div>
        <section className="grid gap-4 rounded-2xl border bg-background p-5 sm:grid-cols-2">
          <div>
            <h2 className="font-semibold">Messages</h2>
            <p className="text-sm text-muted-foreground">
              {overview.messagesThisWeek > 0 ? `${overview.messagesThisWeek} messages this week.` : "Waiting on your reply — nothing this week."}{" "}
              <Link href="/brand/messages" className="font-medium text-brand hover:underline">Open messages</Link>
            </p>
          </div>
          <div>
            <h2 className="font-semibold">Naano experts available</h2>
            <p className="text-sm text-muted-foreground">
              Need an expert eye? 15 minutes with a Naano expert, no commitment.{" "}
              <Link href="/brand/book-a-call" className="font-medium text-brand hover:underline">Book a free call</Link>
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
