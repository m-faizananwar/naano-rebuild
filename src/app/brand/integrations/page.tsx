import type { Metadata } from "next";
import { headers } from "next/headers";
import { PageHeader } from "@/components/page/PageHeader";
import { IntegrationsPanel } from "@/features/workspace/components/integrations/IntegrationsPanel";

import { BRAND } from "@/config/brand";
export const metadata: Metadata = { title: `Integrations · ${BRAND.wordmark}` };

export default async function BrandIntegrationsPage() {
  const h = await headers();
  const origin = `${h.get("x-forwarded-proto") ?? "http"}://${h.get("host") ?? "localhost:3000"}`;
  return (
    <>
      <PageHeader
        title="Integrations"
        description={`Connect ${BRAND.name} to your AI assistant. Read your workspace, prepare actions, confirm on the server.`}
      />
      <IntegrationsPanel role="brand" origin={origin} />
    </>
  );
}
