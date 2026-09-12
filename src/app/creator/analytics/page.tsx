import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/page/PageHeader";
import { getViewer } from "@/features/auth/server/session";
import { RecentPostsList } from "@/features/tracking/components/analytics/RecentPostsList";
import { SnapshotTiles } from "@/features/tracking/components/analytics/SnapshotTiles";
import { TrackedLinksTable } from "@/features/tracking/components/analytics/TrackedLinksTable";
import { RangeSelect } from "@/features/tracking/components/analytics/RangeSelect";
import { ANALYTICS_RANGES, type AnalyticsRange, getPublicPosts, getPublicSnapshot, getTrackedLinkPerformance } from "@/features/tracking/server/creator-queries";

export const metadata: Metadata = { title: "Analytics · naano" };

export default async function CreatorAnalyticsPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const viewer = await getViewer();
  if (!viewer?.creator) redirect("/login");
  const creatorId = viewer.creator.id;
  const { range: raw } = await searchParams;
  const range: AnalyticsRange = (ANALYTICS_RANGES as readonly string[]).includes(raw ?? "") ? (raw as AnalyticsRange) : "all";
  const [snapshot, posts, links] = await Promise.all([getPublicSnapshot(creatorId, range), getPublicPosts(creatorId, range), getTrackedLinkPerformance(creatorId)]);
  return (
    <>
      <PageHeader
        title="Analytics"
        description="Public LinkedIn performance imported for this profile, and clicks on your tracked links."
        actions={<RangeSelect value={range} />}
      />
      <div className="grid gap-4">
        <SnapshotTiles snapshot={snapshot} />
        <TrackedLinksTable rows={links} />
        <RecentPostsList posts={posts} />
      </div>
    </>
  );
}
