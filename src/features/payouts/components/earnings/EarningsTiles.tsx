import { ArrowRight, Wallet } from "lucide-react";
import { CountUp } from "@/components/motion/CountUp";
import { formatCents } from "@/lib/money";
import type { EarningsSummary } from "../../server/queries";
import { WithdrawDialog } from "./WithdrawDialog";

// Total earned · Awaiting release · Available now (the third tile opens Withdraw).
export function EarningsTiles({ summary }: { summary: EarningsSummary }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="rounded-2xl border bg-gradient-to-br from-brand/10 to-background p-5">
        <p className="text-xs font-semibold text-muted-foreground">Total earned</p>
        <p className="mt-2 text-3xl font-semibold tracking-tight"><CountUp value={summary.totalEarnedCents} format="eur" /></p>
        <p className="mt-1 text-xs text-muted-foreground">
          {summary.paidCollaborations} paid collaborations · {formatCents(summary.averageCents, "EUR")} average
        </p>
      </div>
      <div className="rounded-2xl border bg-background p-5">
        <p className="text-xs font-semibold text-muted-foreground">Awaiting release</p>
        <p className="mt-2 text-3xl font-semibold tracking-tight"><CountUp value={summary.awaitingReleaseCents} format="eur" /></p>
        <p className="mt-1 text-xs text-muted-foreground">{summary.awaitingReleaseCount} live posts · released when the brand pays</p>
      </div>
      <WithdrawDialog
        availableCents={summary.availableCents}
        awaitingReleaseCents={summary.awaitingReleaseCents}
        triggerClassName="grid content-start gap-0 rounded-2xl border bg-background p-5 text-left transition-colors hover:border-brand/40 hover:bg-brand/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
        trigger={
          <>
            <span className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
              Available now <Wallet className="size-4" aria-hidden="true" />
            </span>
            <span className="mt-2 block text-3xl font-semibold tracking-tight">{formatCents(summary.availableCents, "EUR")}</span>
            <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-brand">
              Withdraw <ArrowRight className="size-3" aria-hidden="true" />
            </span>
          </>
        }
      />
    </div>
  );
}
