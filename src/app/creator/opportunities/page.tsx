import type { Metadata } from "next";
import { EmptyState } from "@/components/page/EmptyState";
import { PageHeader } from "@/components/page/PageHeader";

export const metadata: Metadata = { title: "Opportunities · naano" };

export default function CreatorOpportunitiesPage() {
  return (
    <>
      <PageHeader title="Opportunities" description="Open brand campaigns — apply, the brand accepts, and the booking is created on your terms." />
      <EmptyState
        title="No open campaigns match your profile yet"
        body="Complete your card so the matching engine can rank campaigns for you."
        cta={{ href: "/creator/card", label: "Open my card" }}
      />
    </>
  );
}
