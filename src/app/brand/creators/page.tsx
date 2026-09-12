import type { Metadata } from "next";
import { ErrorState } from "@/components/page/ErrorState";
import { PageHeader } from "@/components/page/PageHeader";
import { CreatorsTabs } from "@/features/marketplace/components/CreatorsTabs";
import { MarketplaceView } from "@/features/marketplace/components/MarketplaceView";
import { parseMarketplaceQuery, type RawSearchParams } from "@/features/marketplace/schemas";
import { loadMarketplacePage } from "@/features/marketplace/server/queries";

import { BRAND } from "@/config/brand";
export const metadata: Metadata = { title: `Creators · ${BRAND.wordmark}` };

type Props = { searchParams: Promise<RawSearchParams> };

export default async function BrandCreatorsPage({ searchParams }: Props) {
  const query = parseMarketplaceQuery(await searchParams);
  const data = await loadMarketplacePage(query);
  if (data.kind !== "ok") {
    return (
      <>
        <PageHeader title="Creators" />
        <ErrorState
          body={data.kind === "no-brand" ? "Your brand workspace could not be loaded." : "The marketplace could not be loaded. The database may be unreachable."}
          retryHref="/brand/creators"
        />
      </>
    );
  }
  return (
    <>
      <PageHeader title="Creators" />
      <CreatorsTabs active="marketplace" campaignId={data.ctx.selectedCampaign?.id} />
      <MarketplaceView ctx={data.ctx} list={data.list} query={query} countries={data.countries} />
    </>
  );
}
