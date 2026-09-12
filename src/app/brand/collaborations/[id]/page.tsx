import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ErrorState } from "@/components/page/ErrorState";
import { getViewer } from "@/features/auth/server/session";
import { CollaborationDetail } from "@/features/collaborations/components/detail/CollaborationDetail";
import { getCollaborationDetail } from "@/features/collaborations/server/queries";

import { BRAND } from "@/config/brand";
export const metadata: Metadata = { title: `Collaboration · ${BRAND.wordmark}` };

type Props = { params: Promise<{ id: string }> };

export default async function BrandCollaborationPage({ params }: Props) {
  const { id } = await params;
  const viewer = await getViewer();
  if (!viewer?.brand) redirect(`/login?next=/brand/collaborations/${id}`);

  let detail;
  try {
    detail = await getCollaborationDetail({ id, role: "brand", ownerId: viewer.brand.id });
  } catch (error) {
    console.error("[collaborations] brand detail failed", { id, brandId: viewer.brand.id, error });
    return <ErrorState body="We could not load this collaboration. Try again in a moment." retryHref={`/brand/collaborations/${id}`} />;
  }
  if (!detail) notFound();

  return <CollaborationDetail detail={detail} role="brand" csrfToken={viewer.csrfToken} />;
}
