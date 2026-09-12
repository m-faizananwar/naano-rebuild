import type { Metadata } from "next";
import { EmptyState } from "@/components/page/EmptyState";
import { PageHeader } from "@/components/page/PageHeader";

export const metadata: Metadata = { title: "Analytics · naano" };

export default function CreatorAnalyticsPage() {
  return (
    <>
      <PageHeader title="Analytics" description="Public LinkedIn performance imported for this profile." />
      <EmptyState
        title="Public post import in progress"
        body="The first public LinkedIn posts will appear here automatically."
        cta={{ href: "/creator/card", label: "Open my card" }}
      />
    </>
  );
}
