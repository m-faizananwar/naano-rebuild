import type { Metadata } from "next";
import { EmptyState } from "@/components/page/EmptyState";
import { PageHeader } from "@/components/page/PageHeader";

export const metadata: Metadata = { title: "Collaborations · naano" };

export default function BrandCollaborationsPage() {
  return (
    <>
      <PageHeader title="Collaborations" description="Every collaboration across your campaigns, with its status, next action and due date." />
      <EmptyState
        title="No collaborations yet"
        body="Invite a creator from the Marketplace. Accepted bookings show up here."
        cta={{ href: "/brand/creators", label: "Open the marketplace" }}
      />
    </>
  );
}
