import Link from "next/link";
import { EmptyState } from "@/components/page/EmptyState";
import { buttonVariants } from "@/components/ui/button";
import { formatCents } from "@/lib/money";
import { COLLAB_TABS, type CollabTabKey } from "../../constants";
import type { CollaborationRowDto } from "../../schemas";
import { CollaborationsTable } from "./CollaborationsTable";
import { RowsPerPage } from "./RowsPerPage";

type Props = {
  campaignId: string;
  tab: CollabTabKey;
  rows: CollaborationRowDto[];
  counts: Record<CollabTabKey, number> & { committedCents: number };
  page: number;
  perPage: number;
};

export function CollaborationsTab({ campaignId, tab, rows, counts, page, perPage }: Props) {
  const pages = Math.max(1, Math.ceil(rows.length / perPage));
  const current = Math.min(page, pages);
  const visible = rows.slice((current - 1) * perPage, current * perPage);
  const base = `/brand/campaigns/${campaignId}`;
  return (
    <div className="grid gap-4">
      <p className="text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">{counts.all}</span> {counts.all === 1 ? "collaboration" : "collaborations"} ·{" "}
        <span className="font-semibold text-foreground">{formatCents(counts.committedCents, "EUR")}</span> committed ·{" "}
        <span className="font-semibold text-foreground">{counts.todo}</span> to do
      </p>
      <nav aria-label="Collaboration status" className="-mx-4 overflow-x-auto px-4 lg:mx-0 lg:px-0">
        <ul className="flex gap-1 rounded-lg bg-muted p-1 w-fit">
          {COLLAB_TABS.map((t) => (
            <li key={t.key}>
              <Link
                href={t.key === "all" ? base : `${base}?status=${t.key}`}
                aria-current={t.key === tab ? "page" : undefined}
                className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1 text-sm font-medium text-muted-foreground aria-[current=page]:bg-background aria-[current=page]:text-foreground aria-[current=page]:shadow-sm"
              >
                {t.label}
                <span className="text-xs tabular-nums">{counts[t.key]}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {rows.length === 0 ? (
        <EmptyState title="No collaborations yet" body="No collaborations yet, invite a creator from the Marketplace." cta={{ href: `/brand/creators?campaign=${campaignId}`, label: "Invite a creator" }} />
      ) : (
        <>
          <CollaborationsTable rows={visible} />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <RowsPerPage value={perPage} />
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">
                Page {current} of {pages}
              </span>
              <Link
                aria-disabled={current <= 1}
                href={`${base}?status=${tab}&per=${perPage}&page=${current - 1}`}
                className={buttonVariants({ variant: "outline", size: "sm", className: current <= 1 ? "pointer-events-none opacity-50" : "" })}
              >
                Previous
              </Link>
              <Link
                aria-disabled={current >= pages}
                href={`${base}?status=${tab}&per=${perPage}&page=${current + 1}`}
                className={buttonVariants({ variant: "outline", size: "sm", className: current >= pages ? "pointer-events-none opacity-50" : "" })}
              >
                Next
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
