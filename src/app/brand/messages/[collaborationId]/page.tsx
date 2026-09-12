import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ErrorState } from "@/components/page/ErrorState";
import { getViewer } from "@/features/auth/server/session";
import { MessagesLayout } from "@/features/collaborations/components/messages/MessagesLayout";
import { BotThread } from "@/features/collaborations/components/messages/BotThread";
import { ThreadView } from "@/features/collaborations/components/messages/ThreadView";
import { getThread, listThreads, threadScopeFor } from "@/features/collaborations/server/messages-queries";
import { listBrandCampaignOptions } from "@/features/collaborations/server/queries";
import { BOT_THREAD_ID } from "@/features/collaborations/ui-constants";

import { BRAND } from "@/config/brand";
export const metadata: Metadata = { title: `Messages · ${BRAND.wordmark}` };

type Props = { params: Promise<{ collaborationId: string }> };

export default async function BrandThreadPage({ params }: Props) {
  const { collaborationId } = await params;
  const viewer = await getViewer();
  const scope = viewer && threadScopeFor(viewer);
  if (!viewer || !scope) redirect(`/login?next=/brand/messages/${collaborationId}`);
  const isBot = collaborationId === BOT_THREAD_ID;

  let data;
  try {
    data = await Promise.all([
      listThreads(scope),
      listBrandCampaignOptions(scope.ownerId),
      isBot ? null : getThread(scope, collaborationId),
    ]);
  } catch (error) {
    console.error("[messages] brand thread failed", { collaborationId, brandId: scope.ownerId, error });
    return <ErrorState body="We could not load this conversation. Try again in a moment." retryHref={`/brand/messages/${collaborationId}`} />;
  }
  const [threads, campaigns, detail] = data;
  if (!isBot && !detail) notFound();

  return (
    <MessagesLayout threads={threads} role="brand" activeId={collaborationId} campaigns={campaigns}>
      {detail ? (
        <ThreadView detail={detail} role="brand" csrfToken={viewer.csrfToken} senderName={viewer.brand?.company ?? "You"} senderAvatarUrl={null} />
      ) : (
        <BotThread role="brand" />
      )}
    </MessagesLayout>
  );
}
