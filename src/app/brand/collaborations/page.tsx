import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ErrorState } from "@/components/page/ErrorState";
import { PageHeader } from "@/components/page/PageHeader";
import { getViewer } from "@/features/auth/server/session";
import { BrandCollaborationsView } from "@/features/collaborations/components/table/BrandCollaborationsView";
import { listBrandCampaignOptions, listBrandCollaborations } from "@/features/collaborations/server/queries";
import { COPY } from "@/features/collaborations/ui-constants";

export const metadata: Metadata = { title: "Collaborations · naano" };

export default async function BrandCollaborationsPage() {
  const viewer = await getViewer();
  if (!viewer?.brand) redirect("/login?next=/brand/collaborations");

  let data;
  try {
    data = await Promise.all([listBrandCollaborations(viewer.brand.id), listBrandCampaignOptions(viewer.brand.id)]);
  } catch (error) {
    console.error("[collaborations] brand list failed", { brandId: viewer.brand.id, error });
    return (
      <>
        <PageHeader title={COPY.collaborationsTitle} description={COPY.brandCollaborationsDescription} />
        <ErrorState body="We could not load your collaborations. Try again in a moment." retryHref="/brand/collaborations" />
      </>
    );
  }
  const [rows, campaigns] = data;

  return (
    <>
      <PageHeader title={COPY.collaborationsTitle} description={COPY.brandCollaborationsDescription} />
      <BrandCollaborationsView rows={rows} campaigns={campaigns} />
    </>
  );
}
