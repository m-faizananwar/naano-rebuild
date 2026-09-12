import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { EmptyState } from "@/components/page/EmptyState";
import { PageHeader } from "@/components/page/PageHeader";
import { getViewer } from "@/features/auth/server/session";
import { AttributionTable } from "@/features/tracking/components/results/AttributionTable";
import { ClicksChart } from "@/features/tracking/components/results/ClicksChart";
import { PixelCard } from "@/features/tracking/components/results/PixelCard";
import { PublishedPostsTable } from "@/features/tracking/components/results/PublishedPostsTable";
import { ResultsTiles } from "@/features/tracking/components/results/ResultsTiles";
import { SERIES_DAYS, type SeriesRange } from "@/features/tracking/constants";
import {
  getAttributionByCreator, getClicksSeries, getPixelStatus, getPublishedPosts, getResultsSummary,
} from "@/features/tracking/server/queries";

export const metadata: Metadata = { title: "Results · naano" };

async function currentOrigin() {
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${h.get("host") ?? "localhost:3000"}`;
}

export default async function BrandResultsPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const viewer = await getViewer();
  if (!viewer?.brand) redirect("/login");
  const { range: rawRange } = await searchParams;
  const range: SeriesRange = rawRange && rawRange in SERIES_DAYS ? (rawRange as SeriesRange) : "month";
  const origin = await currentOrigin();
  const brandId = viewer.brand.id;
  const [summary, series, attribution, pixel, posts] = await Promise.all([
    getResultsSummary(brandId),
    getClicksSeries(brandId, range),
    getAttributionByCreator(brandId),
    getPixelStatus(brandId),
    getPublishedPosts(brandId, origin),
  ]);

  return (
    <>
      <PageHeader title="Results" description="Est. reach, qualified clicks and committed budget across your campaigns. Every number here is a row you can export." />
      <div className="grid gap-4">
        <ResultsTiles summary={summary} />
        {summary.bookings === 0 ? (
          <EmptyState title="No published posts yet" body="Results appear as soon as a creator's post goes live and the tracked link gets its first click." cta={{ href: "/brand/creators", label: "Find creators" }} />
        ) : null}
        <ClicksChart series={series} range={range} basePath="/brand/results" />
        <PublishedPostsTable posts={posts} />
        {pixel ? <PixelCard pixel={pixel} origin={origin} /> : null}
        <AttributionTable rows={attribution} exportPath="/brand/results/export" />
      </div>
    </>
  );
}
