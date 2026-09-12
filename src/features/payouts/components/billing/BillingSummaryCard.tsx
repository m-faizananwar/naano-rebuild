import { CountUp } from "@/components/motion/CountUp";
import { formatCents } from "@/lib/money";
import { TOPUP_PRESETS_CENTS, TOPUP_QUICK_PRESETS } from "../../constants";
import type { BillingSummary } from "../../server/queries";

type Props = { summary: BillingSummary; onAddBudget: (presetCents?: number) => void };

// "AVAILABLE BALANCE" with "Add budget" and the two quick presets; every button
// opens the Add budget dialog (presets pre-select the amount).
export function BillingSummaryCard({ summary, onAddBudget }: Props) {
  return (
    <section className="grid gap-4 rounded-2xl border bg-background p-5 lg:grid-cols-[1fr_auto] lg:items-center">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Available balance</p>
        <p className="mt-2 text-4xl font-semibold tracking-tight tabular-nums" aria-live="polite"><CountUp value={summary.balanceCents} format="eur" /></p>
        <p className="mt-1 text-sm text-muted-foreground">
          Ready to spend across your campaigns. {formatCents(summary.topupsCents, "EUR")} added · {formatCents(summary.committedCents, "EUR")} committed to bookings.
        </p>
      </div>
      <div className="grid gap-2">
        <button
          type="button"
          onClick={() => onAddBudget()}
          className="rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
        >
          Add budget
        </button>
        <div className="flex flex-wrap gap-2">
          {TOPUP_PRESETS_CENTS.slice(0, TOPUP_QUICK_PRESETS).map((cents) => (
            <button
              key={cents}
              type="button"
              onClick={() => onAddBudget(cents)}
              className="rounded-full border px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
            >
              + {formatCents(cents, "EUR").replace(/\.00$/, "")}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">Demo top-ups credit the ledger directly — no card.</p>
      </div>
    </section>
  );
}
