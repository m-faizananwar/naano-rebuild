import type { Metadata } from "next";
import { PageHeader } from "@/components/page/PageHeader";
import { CreateChooser } from "@/features/campaigns/components/create/CreateChooser";
import { requireBrand } from "@/features/campaigns/server/require-brand";

import { BRAND } from "@/config/brand";
export const metadata: Metadata = { title: `New campaign · ${BRAND.wordmark}` };

export default async function NewCampaignPage() {
  await requireBrand("/brand/campaigns/new");
  return (
    <>
      <PageHeader title="How do you want to launch your campaign?" description="Choose your method. You can change everything before launch." />
      <CreateChooser />
    </>
  );
}
