import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { STATUS_LABELS } from "@/lib/collaboration-labels";
import type { CollaborationStatus } from "@/lib/collaboration-status";
import { formatCents } from "@/lib/money";
import type { CreatorOverview } from "../../server/overview-queries";

const STRONG_MATCH = 70;

export function RecommendedOpportunities({ items }: { items: CreatorOverview["recommended"] }) {
  return (
    <section className="rounded-2xl border bg-background p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold">Recommended opportunities</h2>
          <p className="text-sm text-muted-foreground">The 3 campaigns that best match your audience.</p>
        </div>
        <Link href="/creator/opportunities" className="text-sm font-medium text-brand hover:underline">Explore</Link>
      </div>
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">No open campaigns right now.</p>
      ) : (
        <ul className="mt-3 divide-y">
          {items.map((o) => (
            <li key={o.campaignId}>
              <Link href="/creator/opportunities" className="flex items-center gap-3 py-3 hover:bg-muted/50">
                <span className="flex size-9 items-center justify-center rounded-lg bg-foreground text-sm font-bold text-background">{o.brand.charAt(0)}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{o.brand}</span>
                  <span className="block truncate text-xs text-muted-foreground">{o.name} · {o.fit >= STRONG_MATCH ? "strong match" : "possible match"}</span>
                </span>
                <ArrowRight className="size-4 text-brand" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

const NEXT_ACTION: Record<string, string> = {
  invited: "Accept or decline",
  applied: "Waiting for the brand",
  accepted: "Submit your draft",
  draft_submitted: "Waiting for review",
  changes_requested: "Update your draft",
  approved: "Schedule the post",
  scheduled: "Publish and add the URL",
  live: "Awaiting payment",
};

export function ActiveCollaborations({ items }: { items: CreatorOverview["active"] }) {
  return (
    <section className="rounded-2xl border bg-background p-5">
      <div className="flex items-baseline justify-between">
        <div>
          <h2 className="font-semibold">Active collaborations</h2>
          <p className="text-sm text-muted-foreground">Everything currently moving from brief to publication.</p>
        </div>
        <Link href="/creator/collaborations" className="text-sm font-medium text-brand hover:underline">
          See all <span className="arrow-glyph" aria-hidden="true">→</span>
        </Link>
      </div>
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">No active collaborations.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Brand</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Next action</TableHead>
                <TableHead>Due</TableHead>
                <TableHead className="text-right">Net</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <Link href={`/creator/collaborations/${c.id}`} className="font-medium hover:underline">{c.brand}</Link>
                    <span className="block text-xs text-muted-foreground">{c.campaign}</span>
                  </TableCell>
                  <TableCell><Badge variant="secondary">{STATUS_LABELS[c.status as CollaborationStatus] ?? c.status}</Badge></TableCell>
                  <TableCell className="text-sm">{NEXT_ACTION[c.status] ?? "—"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{c.dueDate ? c.dueDate.slice(0, "YYYY-MM-DD".length) : "—"}</TableCell>
                  <TableCell className="text-right font-medium">{formatCents(c.feeCents, "EUR")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  );
}
