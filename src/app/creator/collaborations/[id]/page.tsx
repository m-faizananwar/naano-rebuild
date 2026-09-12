import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ErrorState } from "@/components/page/ErrorState";
import { getViewer } from "@/features/auth/server/session";
import { CollaborationDetail } from "@/features/collaborations/components/detail/CollaborationDetail";
import { getCollaborationDetail } from "@/features/collaborations/server/queries";

export const metadata: Metadata = { title: "Collaboration · naano" };

type Props = { params: Promise<{ id: string }> };

export default async function CreatorCollaborationPage({ params }: Props) {
  const { id } = await params;
  const viewer = await getViewer();
  if (!viewer?.creator) redirect(`/login?next=/creator/collaborations/${id}`);

  let detail;
  try {
    detail = await getCollaborationDetail({ id, role: "creator", ownerId: viewer.creator.id });
  } catch (error) {
    console.error("[collaborations] creator detail failed", { id, creatorId: viewer.creator.id, error });
    return <ErrorState body="We could not load this collaboration. Try again in a moment." retryHref={`/creator/collaborations/${id}`} />;
  }
  if (!detail) notFound();

  return <CollaborationDetail detail={detail} role="creator" csrfToken={viewer.csrfToken} />;
}
