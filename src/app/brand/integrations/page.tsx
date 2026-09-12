import type { Metadata } from "next";
import { EmptyState } from "@/components/page/EmptyState";
import { PageHeader } from "@/components/page/PageHeader";

export const metadata: Metadata = { title: "Integrations · naano" };

export default function BrandIntegrationsPage() {
  return (
    <>
      <PageHeader title="Integrations" description="NAANO://MCP — one endpoint, any compatible MCP client. Read your workspace, prepare actions, confirm on the server." />
      <EmptyState
        title="The remote MCP endpoint is not part of this build"
        body="The pixel, which does the attribution work, lives under Results."
        cta={{ href: "/brand/results", label: "Go to Results" }}
      />
    </>
  );
}
