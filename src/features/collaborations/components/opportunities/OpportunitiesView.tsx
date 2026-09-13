"use client";

import { StaggerIn } from "@/components/motion/StaggerIn";

import { Store } from "lucide-react";
import { startTransition, useMemo, useOptimistic, useState } from "react";
import { toast } from "sonner";
import { EmptyState } from "@/components/page/EmptyState";
import type { OpportunityDto } from "../../schemas";
import { applyToCampaign } from "../../server/actions";
import { ApplyDialog } from "./ApplyDialog";
import { OpportunityCard } from "./OpportunityCard";
import { type OpportunityFilterState, OpportunityFilters } from "./OpportunityFilters";
import { distinctValues, filterOpportunities } from "./filterOpportunities";

type Props = { opportunities: OpportunityDto[]; csrfToken: string };

const INITIAL_FILTERS: OpportunityFilterState = { channel: "all", query: "", industry: "", region: "", sort: "relevance" };

export function OpportunitiesView({ opportunities, csrfToken }: Props) {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [confirming, setConfirming] = useState<OpportunityDto | null>(null);
  // Campaign ids whose application is in flight: the card flips to "Application
  // sent" immediately and flips back on its own if the action fails.
  const [pendingIds, addPending] = useOptimistic<string[], string>([], (ids, id) => [...ids, id]);

  const industries = useMemo(() => distinctValues(opportunities, (o) => o.industries), [opportunities]);
  const regions = useMemo(() => distinctValues(opportunities, (o) => o.regions), [opportunities]);
  const visible = useMemo(() => filterOpportunities(opportunities, filters), [opportunities, filters]);

  function apply(o: OpportunityDto) {
    setConfirming(null);
    startTransition(async () => {
      addPending(o.campaignId);
      const result = await applyToCampaign({ campaignId: o.campaignId, csrfToken });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(`Application sent to ${o.brandCompany}`, { description: "You'll hear back once the brand reviews it." });
    });
  }

  return (
    <>
      <OpportunityFilters
        value={filters}
        onChange={setFilters}
        counts={{ all: opportunities.length, linkedin: opportunities.length }}
        industries={industries}
        regions={regions}
      />
      {opportunities.length === 0 ? (
        <EmptyState
          icon={Store}
          title="No open campaigns right now"
          body="Brands open campaigns to applications from their Campaigns page. Check back soon, or make sure your card is complete so brands can invite you."
          cta={{ href: "/creator/card", label: "Review my card" }}
        />
      ) : visible.length === 0 ? (
        <EmptyState title="No campaign matches these filters" body="Try another industry, country or search term." />
      ) : (
        <StaggerIn replayKey={visible.map((o) => o.campaignId).join(",")} className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((o) => (
            <OpportunityCard key={o.campaignId} opportunity={o} pending={pendingIds.includes(o.campaignId)} onApply={setConfirming} />
          ))}
        </StaggerIn>
      )}
      <ApplyDialog opportunity={confirming} onOpenChange={(open) => !open && setConfirming(null)} onConfirm={apply} />
    </>
  );
}
