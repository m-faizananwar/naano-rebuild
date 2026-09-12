"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CampaignOptionDto } from "../../schemas";
import { useMarketplaceUrl } from "./useMarketplaceUrl";

type Props = { campaigns: CampaignOptionDto[]; selected: CampaignOptionDto | null };

// The fit % on every card is computed against this campaign's brief.
export function CampaignSelector({ campaigns, selected }: Props) {
  const { update } = useMarketplaceUrl();
  if (campaigns.length === 0) return null;
  const items = Object.fromEntries(campaigns.map((c) => [c.id, c.name]));
  return (
    <div className="flex items-center gap-2">
      <span id="campaign-label" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Fit for
      </span>
      <Select value={selected?.id ?? campaigns[0].id} items={items} onValueChange={(next) => update({ campaign: String(next) }, { keepPage: true })}>
        <SelectTrigger aria-labelledby="campaign-label" className="max-w-56">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {campaigns.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              {c.name}
              <span className="text-xs text-muted-foreground capitalize">· {c.status}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
