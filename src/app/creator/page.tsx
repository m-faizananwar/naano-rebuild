import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/page/PageHeader";
import { buttonVariants } from "@/components/ui/button";
import { getViewer } from "@/features/auth/server/session";
import { TourOverlay } from "@/features/creator-onboarding/components/TourOverlay";
import { DealLinkDialog } from "@/features/workspace/components/card/DealLinkDialog";
import { CopyLinkButton } from "@/features/workspace/components/CopyLinkButton";
import { CreatorCardPreview } from "@/features/workspace/components/overview/CreatorCardPreview";
import { ActiveCollaborations, RecommendedOpportunities } from "@/features/workspace/components/overview/CreatorOverviewPanels";
import { StatTile } from "@/features/workspace/components/overview/StatTile";
import { getCreatorOverview } from "@/features/workspace/server/overview-queries";

export const metadata: Metadata = { title: "Creator workspace · naano" };

export default async function CreatorOverviewPage({ searchParams }: { searchParams: Promise<{ tour?: string }> }) {
  const viewer = await getViewer();
  if (!viewer?.creator) redirect("/login");
  const overview = await getCreatorOverview(viewer.creator.id);
  const h = await headers();
  const cardLink = `${h.get("x-forwarded-proto") ?? "http"}://${h.get("host") ?? "localhost:3000"}/c/${viewer.creator.handle}`;
  const { tour } = await searchParams;
  return (
    <>
      {tour === "1" ? <TourOverlay /> : null}
      <PageHeader eyebrow="Creator workspace" title={`Good to see you, ${viewer.firstName}`} description="Your creator activity, at a glance." />
      <div className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatTile label="Public post reach" value={overview.reach.toLocaleString("en-US")} hint="Impressions across imported posts" />
          <StatTile label="Public posts" value={String(overview.posts)} hint="Original LinkedIn posts found" />
          <StatTile label="Public engagements" value={overview.engagements.toLocaleString("en-US")} hint="Reactions, comments and reposts" />
          <StatTile label="LinkedIn followers" value={overview.followers.toLocaleString("en-US")} hint="Imported from the public profile" />
        </div>
        <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
          <section className="grid gap-3">
            <div>
              <h2 className="font-semibold">Your creator card</h2>
              <p className="text-sm text-muted-foreground">This is how brands discover your positioning and collaboration offer.</p>
            </div>
            <CreatorCardPreview card={overview.card} />
            <div className="flex flex-wrap gap-2">
              <Link href={`/c/${viewer.creator.handle}`} target="_blank" className={buttonVariants({ size: "sm" })}>Open card</Link>
              <CopyLinkButton value={cardLink} label="Copy card link" variant="outline" />
              <DealLinkDialog url={cardLink} handle={viewer.creator.handle} />
              <Link href="/creator/settings" className={buttonVariants({ variant: "ghost", size: "sm" })}>Edit profile</Link>
            </div>
          </section>
          <div className="grid gap-4">
            <RecommendedOpportunities items={overview.recommended} />
            <ActiveCollaborations items={overview.active} />
          </div>
        </div>
      </div>
    </>
  );
}
