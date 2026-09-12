import type { Metadata } from "next";
import { PageHeader } from "@/components/page/PageHeader";
import { IntegrationsPanel } from "@/features/workspace/components/integrations/IntegrationsPanel";

export const metadata: Metadata = { title: "Integrations · naano" };

export default function BrandIntegrationsPage() {
  return (
    <>
      <PageHeader title="Integrations" description="Connect Naano to your AI assistant. Read your workspace, prepare actions, confirm on the server." />
      <IntegrationsPanel role="brand" />
    </>
  );
}
