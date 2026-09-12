import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ErrorState } from "@/components/page/ErrorState";
import { PageHeader } from "@/components/page/PageHeader";
import { getViewer } from "@/features/auth/server/session";
import { OpportunitiesView } from "@/features/collaborations/components/opportunities/OpportunitiesView";
import { listOpportunities } from "@/features/collaborations/server/opportunities-queries";
import { COPY } from "@/features/collaborations/ui-constants";

import { BRAND } from "@/config/brand";
export const metadata: Metadata = { title: `Opportunities · ${BRAND.wordmark}` };

export default async function CreatorOpportunitiesPage() {
  const viewer = await getViewer();
  if (!viewer?.creator) redirect("/login?next=/creator/opportunities");

  let opportunities;
  try {
    opportunities = await listOpportunities(viewer.creator.id);
  } catch (error) {
    console.error("[opportunities] list failed", { creatorId: viewer.creator.id, error });
    return (
      <>
        <PageHeader title={COPY.opportunitiesTitle} description={COPY.opportunitiesDescription} />
        <ErrorState body="We could not load the open campaigns. Try again in a moment." retryHref="/creator/opportunities" />
      </>
    );
  }

  return (
    <>
      <PageHeader title={COPY.opportunitiesTitle} description={COPY.opportunitiesDescription} />
      <OpportunitiesView opportunities={opportunities} csrfToken={viewer.csrfToken} />
    </>
  );
}
