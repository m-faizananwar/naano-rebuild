import type { Metadata } from "next";
import { ErrorState } from "@/components/page/ErrorState";
import { CampaignHeader } from "@/features/campaigns/components/detail/CampaignHeader";
import { CampaignNotFound } from "@/features/campaigns/components/detail/CampaignNotFound";
import { CollaborationsTab } from "@/features/campaigns/components/detail/CollaborationsTab";
import { COLLAB_TABS, type CollabTabKey, DEFAULT_ROWS_PER_PAGE, ROWS_PER_PAGE_OPTIONS } from "@/features/campaigns/constants";
import { countCollaborationsByTab, getCampaignShell, listCollaborationRows } from "@/features/campaigns/server/queries";
import { requireBrand } from "@/features/campaigns/server/require-brand";
import { safeQuery } from "@/features/campaigns/server/safe-query";

import { BRAND } from "@/config/brand";
export const metadata: Metadata = { title: `Campaign · ${BRAND.wordmark}` };

type Props = { params: Promise<{ campaignId: string }>; searchParams: Promise<{ status?: string; per?: string; page?: string }> };

function tabOf(value: string | undefined): CollabTabKey {
  return COLLAB_TABS.some((t) => t.key === value) ? (value as CollabTabKey) : "all";
}

export default async function CampaignCollaborationsPage({ params, searchParams }: Props) {
  const { campaignId } = await params;
  const query = await searchParams;
  const viewer = await requireBrand(`/brand/campaigns/${campaignId}`);
  const tab = tabOf(query.status);
  const perPage = ROWS_PER_PAGE_OPTIONS.find((n) => String(n) === query.per) ?? DEFAULT_ROWS_PER_PAGE;
  const page = Math.max(1, Number(query.page) || 1);

  const result = await safeQuery("campaign collaborations", { brandId: viewer.brand.id, campaignId }, async () => {
    const shell = await getCampaignShell(viewer.brand.id, campaignId);
    if (!shell) return null;
    const [rows, counts] = await Promise.all([listCollaborationRows(campaignId, tab), countCollaborationsByTab(campaignId)]);
    return { shell, rows, counts };
  });
  if (!result.ok) return <ErrorState body="We could not load this campaign." retryHref={`/brand/campaigns/${campaignId}`} />;
  if (!result.data) return <CampaignNotFound />;
  const { shell, rows, counts } = result.data;
  return (
    <CampaignHeader shell={shell} tab="collaborations">
      <CollaborationsTab campaignId={campaignId} tab={tab} rows={rows} counts={counts} page={page} perPage={perPage} />
    </CampaignHeader>
  );
}
