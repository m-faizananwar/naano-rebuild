import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ErrorState } from "@/components/page/ErrorState";
import { PageHeader } from "@/components/page/PageHeader";
import { getViewer } from "@/features/auth/server/session";
import { CreatorCollaborationsView } from "@/features/collaborations/components/table/CreatorCollaborationsView";
import { listCreatorCollaborations } from "@/features/collaborations/server/queries";
import { COPY } from "@/features/collaborations/ui-constants";

export const metadata: Metadata = { title: "Collaborations · naano" };

export default async function CreatorCollaborationsPage() {
  const viewer = await getViewer();
  if (!viewer?.creator) redirect("/login?next=/creator/collaborations");

  let rows;
  try {
    rows = await listCreatorCollaborations(viewer.creator.id);
  } catch (error) {
    console.error("[collaborations] creator list failed", { creatorId: viewer.creator.id, error });
    return (
      <>
        <PageHeader title={COPY.collaborationsTitle} description={COPY.creatorCollaborationsDescription} />
        <ErrorState body="We could not load your collaborations. Try again in a moment." retryHref="/creator/collaborations" />
      </>
    );
  }

  return (
    <>
      <PageHeader title={COPY.collaborationsTitle} description={COPY.creatorCollaborationsDescription} />
      <CreatorCollaborationsView rows={rows} />
    </>
  );
}
