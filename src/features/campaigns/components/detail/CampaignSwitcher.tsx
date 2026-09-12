"use client";

import { useRouter } from "next/navigation";
import { CAMPAIGN_STATUS_LABEL } from "../../constants";
import type { CampaignSummaryDto } from "../../schemas";

type Props = { current: string; summaries: CampaignSummaryDto[]; tab: string };

export function CampaignSwitcher({ current, summaries, tab }: Props) {
  const router = useRouter();
  return (
    <>
      <label htmlFor="campaign-switcher" className="sr-only">
        Switch campaign
      </label>
      <select
        id="campaign-switcher"
        value={current}
        onChange={(event) => router.push(`/brand/campaigns/${event.target.value}${tab}`)}
        className="h-8 max-w-56 rounded-lg border border-input bg-background px-2 text-sm focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        {summaries.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name} · {CAMPAIGN_STATUS_LABEL[c.status]}
          </option>
        ))}
      </select>
    </>
  );
}
