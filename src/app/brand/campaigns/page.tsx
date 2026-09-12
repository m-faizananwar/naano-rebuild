import type { Metadata } from "next";
import { EmptyState } from "@/components/page/EmptyState";
import { PageHeader } from "@/components/page/PageHeader";

export const metadata: Metadata = { title: "Campaigns · naano" };

export default function BrandCampaignsPage() {
  return (
    <>
      <PageHeader title="Campaigns" description="Launch a new campaign in 2 minutes — with AI, the Naano team, or an existing link." />
      <EmptyState
        title="No campaigns yet"
        body="Create a campaign to get a brief your creators can work from."
        cta={{ href: "/brand/creators", label: "Find creators first" }}
      />
    </>
  );
}
