import { formatCents } from "@/lib/money";
import type { AnalyticsDto } from "../../schemas";
import { AttributionTable } from "./AttributionTable";
import { ClicksChart } from "./ClicksChart";
import { PostPerformance } from "./PostPerformance";
import { StatTile } from "./StatTile";

// Results, scoped to one campaign. Every number is a count or sum over rows.
export function AnalyticsTab({ analytics }: { analytics: AnalyticsDto }) {
  const hasClicks = analytics.daily.some((d) => d.clicks > 0);
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile
          label="Est. reach"
          value={analytics.publishedPosts === 0 ? "—" : analytics.estReach.toLocaleString("en-GB")}
          hint={analytics.publishedPosts === 0 ? "No published posts yet" : `Median views of ${analytics.publishedPosts} published ${analytics.publishedPosts === 1 ? "post" : "posts"}`}
        />
        <StatTile label="Qualified clicks" value={analytics.qualifiedClicks.toLocaleString("en-GB")} hint="Since the campaign started" />
        <StatTile label="Committed budget" value={formatCents(analytics.committedCents, "EUR")} hint={`${analytics.bookings} ${analytics.bookings === 1 ? "booking" : "bookings"}`} />
      </div>
      <section className="rounded-2xl border bg-background p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-lg font-semibold">Performance over time</h2>
          <span className="text-xs text-muted-foreground">Daily clicks · last 12 days</span>
        </div>
        {hasClicks ? (
          <div className="mt-4">
            <ClicksChart data={analytics.daily} />
          </div>
        ) : (
          <p className="mt-4 rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
            No clicks in the last 12 days. Each creator gets a tracked link once they accept; clicks show up here.
          </p>
        )}
      </section>
      <div className="grid gap-4 lg:grid-cols-2">
        <AttributionTable rows={analytics.byCreator} />
        <PostPerformance posts={analytics.posts} />
      </div>
    </div>
  );
}
