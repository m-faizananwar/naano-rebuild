import { formatCents } from "@/lib/money";
import type { EstimateDto } from "../schemas";

const CONFIDENCE_CLASS = { High: "bg-brand/10 text-brand", Medium: "bg-muted text-foreground", Low: "bg-muted text-muted-foreground" } as const;

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-xl font-semibold tabular-nums">{value}</dd>
    </div>
  );
}

// Pre-spend estimate for a creator selection (src/lib/estimator.ts).
export function EstimatorCard({ estimate }: { estimate: EstimateDto }) {
  return (
    <section aria-labelledby="estimator-title" className="rounded-2xl border bg-background p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="estimator-title" className="text-lg font-semibold">
          What to expect
        </h2>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${CONFIDENCE_CLASS[estimate.confidence]}`}>Confidence {estimate.confidence}</span>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-5">
        <Metric label="Est. clicks" value={estimate.estClicks.toLocaleString("en-GB")} />
        <Metric label="Est. leads" value={estimate.estLeads.toLocaleString("en-GB")} />
        <Metric label="Est. CPL" value={estimate.estCplCents === null ? "—" : formatCents(estimate.estCplCents, "EUR")} />
        <Metric label="Est. CPC" value={estimate.estCpcCents === null ? "—" : formatCents(estimate.estCpcCents, "EUR")} />
        <Metric label="Total spend" value={formatCents(estimate.totalSpendCents, "EUR")} />
      </dl>
      <p className="mt-4 text-xs text-muted-foreground">
        {estimate.creatorsWithReach} of {estimate.creators} {estimate.creators === 1 ? "creator has" : "creators have"} reach data · benchmark CPL{" "}
        {formatCents(estimate.benchmarkCplCents, "EUR")} for {estimate.vertical === "default" ? "the marketplace" : estimate.vertical}. {estimate.sourceNote}
      </p>
    </section>
  );
}
