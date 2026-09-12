import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { EmptyState } from "@/components/page/EmptyState";
import { PageHeader } from "@/components/page/PageHeader";
import { getViewer } from "@/features/auth/server/session";

export const metadata: Metadata = { title: "Creator workspace · naano" };

export default async function CreatorOverviewPage() {
  const viewer = await getViewer();
  if (!viewer) redirect("/login");
  return (
    <>
      <PageHeader
        eyebrow="Creator workspace"
        title={`Good to see you, ${viewer.firstName}`}
        description="Your creator activity, at a glance."
      />
      <EmptyState
        title="No active collaborations"
        body="Brand invitations and your accepted applications will move from brief to publication here."
        cta={{ href: "/creator/opportunities", label: "Explore opportunities" }}
      />
    </>
  );
}
