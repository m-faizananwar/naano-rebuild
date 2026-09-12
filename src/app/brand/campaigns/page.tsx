import type { Metadata } from "next";
import { ErrorState } from "@/components/page/ErrorState";
import { PageHeader } from "@/components/page/PageHeader";
import { CampaignsList } from "@/features/campaigns/components/list/CampaignsList";
import { getLaunchPlan, listCampaignCards } from "@/features/campaigns/server/queries";
import { requireBrand } from "@/features/campaigns/server/require-brand";
import { safeQuery } from "@/features/campaigns/server/safe-query";

import { BRAND } from "@/config/brand";
export const metadata: Metadata = { title: `Campaigns · ${BRAND.wordmark}` };

export default async function BrandCampaignsPage() {
  const viewer = await requireBrand("/brand/campaigns");
  const result = await safeQuery("campaigns list", { brandId: viewer.brand.id }, () =>
    Promise.all([listCampaignCards(viewer.brand.id), getLaunchPlan(viewer.brand.id)]),
  );
  if (!result.ok) {
    return (
      <>
        <PageHeader title="Campaigns" />
        <ErrorState body="We could not load your campaigns. The details are in the server log." retryHref="/brand/campaigns" />
      </>
    );
  }
  const [campaigns, plan] = result.data;
  return (
    <>
      <PageHeader title="Campaigns" description="Every brief your creators work from, with the numbers behind it." />
      <CampaignsList campaigns={campaigns} plan={plan} />
    </>
  );
}
