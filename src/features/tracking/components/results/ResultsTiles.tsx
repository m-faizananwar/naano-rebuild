import { formatCents } from "@/lib/money";
import type { ResultsSummary } from "../../server/queries";

function Tile({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-2xl border bg-background p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{hint}</p>
    </div>
  );
}

export function ResultsTiles({ summary }: { summary: ResultsSummary }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Tile
        label="Est. reach"
        value={summary.publishedPosts > 0 ? summary.estReach.toLocaleString("en-US") : "—"}
        hint={summary.publishedPosts > 0 ? `${summary.publishedPosts} published posts · median views per creator` : "No published posts yet"}
      />
      <Tile label="Qualified clicks" value={summary.clicksInWindow.toLocaleString("en-US")} hint={`last ${summary.windowDays} days · ${summary.signups} sign-ups via pixel`} />
      <Tile label="Committed budget" value={formatCents(summary.committedCents, "EUR")} hint={`${summary.bookings} bookings`} />
    </div>
  );
}
