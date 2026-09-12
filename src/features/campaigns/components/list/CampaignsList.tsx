import { EmptyState } from "@/components/page/EmptyState";
import type { CampaignCardDto, LaunchPlanDto } from "../../schemas";
import { CampaignCard } from "./CampaignCard";
import { CreateCampaignCard } from "./CreateCampaignCard";
import { LaunchPlanCard } from "./LaunchPlanCard";

import { BRAND } from "@/config/brand";
type Props = { campaigns: CampaignCardDto[]; plan: LaunchPlanDto };

export function CampaignsList({ campaigns, plan }: Props) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="grid gap-4 md:grid-cols-2">
        {campaigns.length === 0 ? (
          <div className="md:col-span-2">
            <EmptyState
              title="No campaigns yet"
              body={`Create a campaign to get a brief your creators can work from. AI, the ${BRAND.name} team, or a link you already have.`}
              cta={{ href: "/brand/campaigns/new", label: "Create a campaign" }}
            />
          </div>
        ) : (
          campaigns.map((campaign) => <CampaignCard key={campaign.id} campaign={campaign} />)
        )}
        <CreateCampaignCard />
      </div>
      <LaunchPlanCard plan={plan} />
    </div>
  );
}
