import type { Metadata } from "next";
import { EmptyState } from "@/components/page/EmptyState";
import { PageHeader } from "@/components/page/PageHeader";

export const metadata: Metadata = { title: "Collaborations · naano" };

export default function CreatorCollaborationsPage() {
  return (
    <>
      <PageHeader title="Collaborations" description="Every step tells you where you stand, what to do, and what happens if you do nothing." />
      <EmptyState
        title="No collaborations yet"
        body="Brand invitations and your accepted applications land here."
        cta={{ href: "/creator/opportunities", label: "Browse opportunities" }}
      />
    </>
  );
}
