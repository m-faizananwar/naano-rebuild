import type { Metadata } from "next";
import { EmptyState } from "@/components/page/EmptyState";
import { PageHeader } from "@/components/page/PageHeader";

export const metadata: Metadata = { title: "Community · naano" };

export default function CreatorCommunityPage() {
  return (
    <>
      <PageHeader title="Community" description="Learn with other B2B creators, share what works and make your Naano identity visible." />
      <EmptyState
        title="Naano creators on Slack"
        body="The room where B2B creators get better together: feedback before you publish, campaign tips that work."
        cta={{ href: "/creator/card", label: "Publish my card" }}
      />
    </>
  );
}
