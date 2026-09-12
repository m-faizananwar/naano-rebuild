import type { Metadata } from "next";
import { ErrorState } from "@/components/page/ErrorState";
import { PageHeader } from "@/components/page/PageHeader";
import { WelcomeCoachMark } from "@/features/brand-onboarding/components/WelcomeCoachMark";
import { CreatorsTabs } from "@/features/marketplace/components/CreatorsTabs";
import { MatchingView } from "@/features/marketplace/components/matching/MatchingView";
import { parseMarketplaceQuery, type RawSearchParams } from "@/features/marketplace/schemas";
import { loadMatchingPage } from "@/features/marketplace/server/queries";

export const metadata: Metadata = { title: "AI Matching · naano" };

type Props = { searchParams: Promise<RawSearchParams> };

export default async function BrandMatchingPage({ searchParams }: Props) {
  const query = parseMarketplaceQuery(await searchParams);
  const data = await loadMatchingPage(query);
  if (data.kind !== "ok") {
    return (
      <>
        <PageHeader title="Creators" />
        <ErrorState
          body={data.kind === "no-brand" ? "Your brand workspace could not be loaded." : "AI Matching could not be loaded. The database may be unreachable."}
          retryHref="/brand/creators/matching"
        />
      </>
    );
  }
  return (
    <>
      <PageHeader title="Creators" />
      <CreatorsTabs active="matching" campaignId={data.ctx.selectedCampaign?.id} />
      <MatchingView ctx={data.ctx} />
      <WelcomeCoachMark />
    </>
  );
}
