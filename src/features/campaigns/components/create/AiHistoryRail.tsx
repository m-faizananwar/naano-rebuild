import Link from "next/link";
import { CAMPAIGN_STATUS_LABEL } from "../../constants";
import type { CampaignSummaryDto } from "../../schemas";

export function AiHistoryRail({ history }: { history: CampaignSummaryDto[] }) {
  return (
    <nav aria-label="History" className="rounded-2xl border bg-background p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">History</p>
      {history.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">No discussion yet. Your next AI-generated campaign will appear here.</p>
      ) : (
        <ul className="mt-3 divide-y">
          {history.map((campaign) => (
            <li key={campaign.id}>
              <Link
                href={campaign.status === "draft" ? `/brand/campaigns/${campaign.id}/launch` : `/brand/campaigns/${campaign.id}`}
                className="block rounded-md py-2 text-sm hover:text-brand"
              >
                <span className="line-clamp-1 font-medium">{campaign.name}</span>
                <span className="text-xs text-muted-foreground">{CAMPAIGN_STATUS_LABEL[campaign.status]}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
