import { timeLeftLabel } from "@/lib/collaboration-labels";
import { formatDate } from "@/lib/dates";
import { formatCents } from "@/lib/money";
import type { CollaborationDto } from "../../schemas";

function Term({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-right text-sm font-medium">{value}</dd>
    </div>
  );
}

// The offer as it was made: list price, discount, review rule, deadline to answer.
export function OfferTerms({ collaboration: c }: { collaboration: CollaborationDto }) {
  const timeLeft = c.status === "invited" ? timeLeftLabel(c.acceptBy) : null;
  return (
    <section className="rounded-2xl border bg-background p-5">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Offer terms</h2>
      <dl className="mt-2 divide-y">
        <Term label="Fee per post" value={formatCents(c.feeCents, "EUR")} />
        {c.listPriceCents !== null && c.listPriceCents !== c.feeCents ? (
          <Term label="List price" value={`${formatCents(c.listPriceCents, "EUR")} · ${c.discountPercent}% off`} />
        ) : null}
        <Term label="Origin" value={c.origin === "invitation" ? "Brand invitation" : "Creator application"} />
        <Term label="Review" value={c.approveBeforePublish ? "Approve before publish" : "Publish without review"} />
        <Term label="Due date" value={formatDate(c.dueDate, "No deadline")} />
        {c.acceptBy ? <Term label="Answer by" value={`${formatDate(c.acceptBy)}${timeLeft ? ` · ${timeLeft}` : ""}`} /> : null}
        {c.scheduledAt ? <Term label="Scheduled for" value={formatDate(c.scheduledAt)} /> : null}
        {c.publishedAt ? <Term label="Published" value={formatDate(c.publishedAt)} /> : null}
        {c.paidAt ? <Term label="Paid" value={formatDate(c.paidAt)} /> : null}
      </dl>
      {c.offerNote ? <p className="mt-3 rounded-lg bg-muted/50 px-3 py-2 text-sm">{c.offerNote}</p> : null}
    </section>
  );
}
