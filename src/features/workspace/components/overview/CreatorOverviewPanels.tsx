import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCents } from "@/lib/money";
import type { CreatorOverview } from "../../server/overview-queries";

export function RecommendedOpportunities({ items }: { items: CreatorOverview["recommended"] }) {
  return (
    <section className="rounded-2xl border bg-background p-5">
      <h2 className="font-semibold">Recommended opportunities</h2>
      <p className="text-sm text-muted-foreground">The {items.length} campaigns that best match your audience</p>
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">No open campaigns right now.</p>
      ) : (
        <ul className="mt-4 divide-y">
          {items.map((o) => (
            <li key={o.campaignId} className="flex items-center gap-3 py-3">
              <span className="flex size-9 items-center justify-center rounded-lg bg-muted font-semibold">{o.brand.charAt(0)}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium">{o.brand}</span>
                <span className="block truncate text-xs text-muted-foreground">{o.name} · {o.fit >= 70 ? "strong match" : "possible match"}</span>
              </span>
              <span className="text-sm font-semibold text-brand">{o.fit}%</span>
              <Link href="/creator/opportunities" className={buttonVariants({ variant: "outline", size: "sm" })}>
                Explore
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
          <p className="text-sm text-muted-foreground">Everything currently moving from brief to publication</p>
        </div>
        <Link href="/creator/collaborations" className="text-sm font-medium text-brand hover:underline">
          See all →
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
                  <TableCell><Badge variant="secondary">{c.status.replaceAll("_", " ")}</Badge></TableCell>
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
