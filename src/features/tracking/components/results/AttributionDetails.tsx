import { ChevronDown } from "lucide-react";
import { formatCents } from "@/lib/money";
import type { AttributionDetails as Details } from "../../server/queries";

function Bars({ rows, label }: { rows: Array<{ key: string; clicks: number }>; label: string }) {
  const max = Math.max(1, ...rows.map((r) => r.clicks));
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      {rows.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">No clicks yet.</p>
      ) : (
        <ul className="mt-2 grid gap-1.5">
          {rows.map((r) => (
            <li key={r.key} className="grid grid-cols-[7rem_1fr_3rem] items-center gap-2 text-sm">
              <span className="truncate">{r.key}</span>
              <span className="h-2 rounded-full bg-muted">
                <span className="animate-fill block h-2 rounded-full bg-brand" style={{ width: `${Math.round((r.clicks / max) * 100)}%` }} />
              </span>
              <span className="text-right tabular-nums">{r.clicks}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// naano's "More metrics & attribution details" — expanded from the same click and pixel rows.
export function AttributionDetails({ details }: { details: Details }) {
  return (
    <details className="accordion group rounded-2xl border bg-background">
      <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 font-semibold marker:content-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 [&::-webkit-details-marker]:hidden">
        More metrics &amp; attribution details
        <ChevronDown className="size-4 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden="true" />
      </summary>
      <div className="grid gap-6 border-t px-5 py-4 [--accordion-height:24rem] md:grid-cols-3">
        <Bars label="Clicks by country" rows={details.byCountry.map((r) => ({ key: r.country, clicks: r.clicks }))} />
        <Bars label="Clicks by referrer" rows={details.byReferrer.map((r) => ({ key: r.referrer, clicks: r.clicks }))} />
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Pixel events</p>
          <dl className="mt-2 grid grid-cols-2 gap-2 text-sm">
            <dt className="text-muted-foreground">Visits</dt><dd className="text-right tabular-nums">{details.events.visits}</dd>
            <dt className="text-muted-foreground">Sign-ups</dt><dd className="text-right tabular-nums">{details.events.signups}</dd>
            <dt className="text-muted-foreground">Purchases</dt><dd className="text-right tabular-nums">{details.events.purchases}</dd>
            <dt className="text-muted-foreground">Revenue</dt><dd className="text-right tabular-nums">{formatCents(details.events.revenueCents, "EUR")}</dd>
          </dl>
        </div>
      </div>
    </details>
  );
}
