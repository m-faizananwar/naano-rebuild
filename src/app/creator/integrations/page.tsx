import type { Metadata } from "next";
import { PageHeader } from "@/components/page/PageHeader";
import { IntegrationsPanel } from "@/features/workspace/components/integrations/IntegrationsPanel";

export const metadata: Metadata = { title: "Connect your AI assistant · naano" };

export default function CreatorIntegrationsPage() {
  return (
    <>
      <PageHeader title="Connect your AI assistant" description="Claude · ChatGPT · Gemini CLI · Cursor · GitHub Copilot · any MCP client. Read briefs and deadlines, submit drafts with confirmation." />
      <IntegrationsPanel role="creator" />
    </>
  );
}
