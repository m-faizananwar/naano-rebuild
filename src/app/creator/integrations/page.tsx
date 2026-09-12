import type { Metadata } from "next";
import { EmptyState } from "@/components/page/EmptyState";
import { PageHeader } from "@/components/page/PageHeader";

export const metadata: Metadata = { title: "Connect your AI assistant · naano" };

export default function CreatorIntegrationsPage() {
  return (
    <>
      <PageHeader title="Connect your AI assistant" description="Claude · ChatGPT · Gemini CLI · Cursor · GitHub Copilot · any MCP client. Read briefs and deadlines, submit drafts with confirmation." />
      <EmptyState
        title="The remote MCP endpoint is not part of this build"
        body="Everything it would read is in your workspace already."
        cta={{ href: "/creator", label: "Back to overview" }}
      />
    </>
  );
}
