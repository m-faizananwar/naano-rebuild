import { formatCents } from "@/lib/money";
import type { EarningsSummary } from "../../server/queries";

export function EarningsTiles({ summary }: { summary: EarningsSummary }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="rounded-2xl border bg-gradient-to-br from-brand/10 to-background p-5">
        <p className="text-xs font-semibold text-muted-foreground">Total earned</p>
        <p className="mt-2 text-3xl font-semibold tracking-tight">{formatCents(summary.totalEarnedCents, "EUR")}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {summary.paidCollaborations} paid collaborations · {formatCents(summary.averageCents, "EUR")} average
        </p>
      </div>
      <div className="rounded-2xl border bg-background p-5">
        <p className="text-xs font-semibold text-muted-foreground">Awaiting release</p>
        <p className="mt-2 text-3xl font-semibold tracking-tight">{formatCents(summary.awaitingReleaseCents, "EUR")}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {summary.awaitingReleaseCount} live posts · released when the brand pays
        </p>
      </div>
      <div className="rounded-2xl border bg-background p-5">
        <p className="text-xs font-semibold text-muted-foreground">Available now</p>
        <p className="mt-2 text-3xl font-semibold tracking-tight">{formatCents(summary.availableCents, "EUR")}</p>
        <p className="mt-1 text-xs text-muted-foreground">Ready to withdraw to your selected payout method.</p>
      </div>
    </div>
  );
}
