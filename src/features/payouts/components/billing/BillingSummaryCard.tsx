import { formatCents } from "@/lib/money";
import { TOPUP_PRESETS_CENTS } from "../../constants";
import type { BillingSummary } from "../../server/queries";

export function BillingSummaryCard({ summary }: { summary: BillingSummary }) {
  return (
    <section className="grid gap-4 rounded-2xl border bg-background p-5 lg:grid-cols-[1fr_auto] lg:items-center">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Available balance</p>
        <p className="mt-2 text-4xl font-semibold tracking-tight">{formatCents(summary.balanceCents, "EUR")}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Ready to spend across your campaigns. {formatCents(summary.topupsCents, "EUR")} added · {formatCents(summary.committedCents, "EUR")} committed to bookings.
        </p>
      </div>
      <div className="grid gap-2">
        <button type="button" disabled className="rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background opacity-60" title="Top-ups arrive with the billing dialog">
          Add budget
        </button>
        <div className="flex flex-wrap gap-2">
          {TOPUP_PRESETS_CENTS.slice(0, 2).map((cents) => (
            <button key={cents} type="button" disabled className="rounded-full border px-3 py-1.5 text-xs font-semibold text-muted-foreground opacity-60">
              + {formatCents(cents, "EUR")}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">Top-ups are not wired in this build yet.</p>
      </div>
    </section>
  );
}
