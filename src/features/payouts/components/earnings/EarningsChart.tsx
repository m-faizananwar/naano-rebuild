import { formatCents } from "@/lib/money";
import type { MonthPoint } from "../../server/queries";

// Six monthly bars, pure CSS so the server renders it.
export function EarningsChart({ months }: { months: MonthPoint[] }) {
  const max = Math.max(1, ...months.map((m) => m.cents));
  const total = months.reduce((sum, m) => sum + m.cents, 0);
  return (
    <section className="rounded-2xl border bg-background p-5">
      <div className="flex items-baseline justify-between">
        <div>
          <h2 className="font-semibold">Earnings over time</h2>
          <p className="text-sm text-muted-foreground">Net collaboration earnings from the last six months.</p>
        </div>
        <p className="text-sm text-muted-foreground">{formatCents(total, "EUR")} over 6 months</p>
      </div>
      <ol className="mt-6 grid grid-cols-6 gap-3">
        {months.map((m) => (
          <li key={m.month} className="flex flex-col items-center gap-2">
            <span className="text-xs text-muted-foreground">{formatCents(m.cents, "EUR")}</span>
            <div className="flex h-40 w-full items-end rounded-lg bg-muted/60">
              <div
                className="w-full rounded-lg bg-brand"
                style={{ height: `${Math.max(2, Math.round((m.cents / max) * 100))}%` }}
                aria-label={`${m.label}: ${formatCents(m.cents, "EUR")}`}
              />
            </div>
            <span className="text-xs font-medium">{m.label}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
