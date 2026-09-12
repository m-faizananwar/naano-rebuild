import Link from "next/link";
import { BriefEditor } from "../brief/BriefEditor";
import type { LaunchStepKey } from "../../constants";
import type { BrandProfile, CampaignDto, LaunchStepData } from "../../schemas";
import { BasicsForm } from "./BasicsForm";
import { type GeneratedWith, GeneratedWithBanner } from "./GeneratedWithBanner";
import { PickCreatorsForm } from "./PickCreatorsForm";
import { ReviewStep } from "./ReviewStep";
import { StepNav } from "./StepNav";

type Props = { campaign: CampaignDto; brand: BrandProfile; data: LaunchStepData; generatedWith?: GeneratedWith };

const TITLES: Record<LaunchStepKey, { title: string; body: string }> = {
  basics: { title: "Basics", body: "Name, description, deadline and the default fee creators see." },
  brief: { title: "Brief", body: "What every invited creator receives. Preview shows it the way they read it." },
  creators: { title: "Pick creators", body: "Your best-fit creators for this brief, ranked. Invitations are funded from your wallet." },
  review: { title: "Review & launch", body: "Check the numbers, then launch: the campaign goes active and invitations go out." },
};

export function LaunchStepper({ campaign, brand, data, generatedWith }: Props) {
  const base = `/brand/campaigns/${campaign.id}/launch`;
  const detail = `/brand/campaigns/${campaign.id}`;
  const { title, body } = TITLES[data.step];
  return (
    <div className="grid gap-6">
      <div>
        <Link href="/brand/campaigns" className="text-sm text-muted-foreground hover:text-foreground">
          ← Campaigns
        </Link>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">{campaign.name}</h1>
        <div className="mt-4">
          <StepNav campaignId={campaign.id} active={data.step} />
        </div>
      </div>
      {generatedWith ? <GeneratedWithBanner generatedWith={generatedWith} /> : null}
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{body}</p>
      </div>
      {data.step === "basics" ? <BasicsForm campaign={campaign} nextHref={`${base}?step=brief`} cancelHref={detail} /> : null}
      {data.step === "brief" ? (
        <BriefEditor campaignId={campaign.id} initial={campaign.brief} cancelHref={`${base}?step=basics`} afterSaveHref={`${base}?step=creators`} saveLabel="Save and continue" />
      ) : null}
      {data.step === "creators" ? <PickCreatorsForm campaignId={campaign.id} creators={data.creators} walletCents={brand.walletCents} backHref={`${base}?step=brief`} /> : null}
      {data.step === "review" ? <ReviewStep campaign={campaign} creators={data.creators} estimate={data.estimate} walletCents={brand.walletCents} /> : null}
    </div>
  );
}
