import type { Metadata } from "next";
import { headers } from "next/headers";
import { PageHeader } from "@/components/page/PageHeader";
import { IntegrationsPanel } from "@/features/workspace/components/integrations/IntegrationsPanel";

export const metadata: Metadata = { title: "Connect your AI assistant · naano" };

export default async function CreatorIntegrationsPage() {
  const h = await headers();
  const origin = `${h.get("x-forwarded-proto") ?? "http"}://${h.get("host") ?? "localhost:3000"}`;
  return (
    <>
      <PageHeader
        title="Connect your AI assistant"
        description="Claude · ChatGPT · Gemini CLI · Cursor · GitHub Copilot · any MCP client. Read briefs and deadlines, submit drafts with confirmation."
      />
      <IntegrationsPanel role="creator" origin={origin} />
    </>
  );
}
