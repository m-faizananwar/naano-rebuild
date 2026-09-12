"use client";

import { Globe } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { STATUS_LABELS } from "@/lib/collaboration-labels";
import type { OpportunityDto } from "../../schemas";
import { BrandMark } from "../BrandMark";
import { LinkedInMark } from "../LinkedInMark";
import { ViewBriefButton } from "../brief/ViewBriefButton";
import { StatusBadge } from "../table/StatusBadge";

type Props = { opportunity: OpportunityDto; pending: boolean; onApply: (opportunity: OpportunityDto) => void };

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center px-2 py-2.5">
      <span className="text-sm font-semibold">{value}</span>
      <span className="text-[0.625rem] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
    </div>
  );
}

function deadlineLabel(days: number | null) {
  if (days === null) return "Open";
  if (days === 0) return "Today";
  return `${days} day${days === 1 ? "" : "s"}`;
}

export function OpportunityCard({ opportunity: o, pending, onApply }: Props) {
  const state = o.existingStatus;
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border bg-background shadow-xs">
      <div className="relative h-24 bg-linear-to-b from-sky-100 via-sky-50 to-background dark:from-sky-950/40 dark:via-sky-950/10">
        <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-background px-2.5 py-1 text-xs font-semibold shadow-xs">
          <LinkedInMark className="size-3.5" />
          LinkedIn
        </span>
        <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-background px-2.5 py-1 text-xs font-semibold text-brand shadow-xs">
          <span className="size-1.5 rounded-full bg-brand" aria-hidden="true" />
          {o.matchScore}% match
        </span>
        <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 rounded-2xl bg-background p-1 shadow-sm">
          <BrandMark initial={o.brandInitial} name={o.brandCompany} size="lg" />
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center px-4 pt-9 pb-4 text-center">
        <h2 className="text-lg font-semibold">{o.brandCompany}</h2>
        <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground" title={o.campaignName}>
          {o.campaignName}
        </p>
        {o.regions.length > 0 ? (
          <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
            <Globe className="size-3" aria-hidden="true" />
            {o.regions.join(" · ")}
          </span>
        ) : null}

        <div className="mt-4 w-full rounded-xl border px-3 py-2.5 text-left">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-muted-foreground">Audience relevance</span>
            <span className="font-semibold text-brand">{o.matchScore}/100</span>
          </div>
          <div
            role="progressbar"
            aria-label="Audience relevance"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={o.matchScore}
            className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"
          >
            <div className="h-full rounded-full bg-brand" style={{ width: `${o.matchScore}%` }} />
          </div>
        </div>

        <div className="mt-3 grid w-full grid-cols-3 divide-x rounded-xl bg-muted/60">
          <Stat value={`${o.matchScore}/100`} label="Match" />
          <Stat value="LinkedIn" label="Channel" />
          <Stat value={deadlineLabel(o.daysToDeadline)} label="Post deadline" />
        </div>

        <div className="mt-4 grid w-full grid-cols-2 gap-2">
          <ViewBriefButton brief={o.brief} className="w-full" />
          {state && o.existingCollaborationId ? (
            <Link
              href={`/creator/collaborations/${o.existingCollaborationId}`}
              className={buttonVariants({ variant: "secondary", className: "w-full gap-2" })}
              aria-label={`${STATUS_LABELS[state]} — open the collaboration`}
            >
              <StatusBadge status={state} />
            </Link>
          ) : (
            <Button
              type="button"
              className="w-full bg-brand text-brand-foreground hover:bg-brand/90"
              disabled={pending}
              onClick={() => onApply(o)}
            >
              {pending ? "Application sent" : "Apply"}
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
