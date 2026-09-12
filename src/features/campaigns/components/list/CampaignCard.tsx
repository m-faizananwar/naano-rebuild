import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatDay } from "@/lib/dates";
import { formatCents } from "@/lib/money";
import { CAMPAIGN_STATUS_LABEL } from "../../constants";
import type { CampaignCardDto } from "../../schemas";

const STATUS_VARIANT = { draft: "outline", active: "default", completed: "secondary" } as const;

export function CampaignCard({ campaign }: { campaign: CampaignCardDto }) {
  const detail = `/brand/campaigns/${campaign.id}`;
  return (
    <article className="flex flex-col rounded-2xl border bg-background p-5">
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <Badge variant={STATUS_VARIANT[campaign.status]}>{CAMPAIGN_STATUS_LABEL[campaign.status]}</Badge>
        <span aria-hidden="true">·</span>
        <span className="font-semibold uppercase tracking-wider">Created on {formatDay(campaign.createdAt)}</span>
      </div>
      <h2 className="mt-3 text-lg font-semibold leading-tight">
        <Link href={detail} className="hover:underline">
          {campaign.name}
        </Link>
      </h2>
      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{campaign.description || "No description yet."}</p>
      <dl className="mt-4 grid grid-cols-3 gap-3 border-t pt-4">
        <div>
          <dt className="text-xs text-muted-foreground">Creators</dt>
          <dd className="text-lg font-semibold tabular-nums">{campaign.creators}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Published</dt>
          <dd className="text-lg font-semibold tabular-nums">{campaign.published}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Committed budget</dt>
          <dd className="text-lg font-semibold tabular-nums">{formatCents(campaign.committedCents, "EUR")}</dd>
        </div>
      </dl>
      <div className="mt-4 flex gap-4 text-sm font-medium">
        <Link href={campaign.status === "draft" ? `${detail}/launch` : detail} className="text-brand hover:underline">
          {campaign.status === "draft" ? "Continue setup" : "Open campaign"} →
        </Link>
        <Link href={`${detail}/brief`} className="text-brand hover:underline">
          My brief →
        </Link>
      </div>
    </article>
  );
}
