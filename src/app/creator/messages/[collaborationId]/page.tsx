import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ErrorState } from "@/components/page/ErrorState";
import { getViewer } from "@/features/auth/server/session";
import { MessagesLayout } from "@/features/collaborations/components/messages/MessagesLayout";
import { BotThread } from "@/features/collaborations/components/messages/BotThread";
import { ThreadView } from "@/features/collaborations/components/messages/ThreadView";
import { getThread, listThreads, threadScopeFor } from "@/features/collaborations/server/messages-queries";
import { BOT_THREAD_ID } from "@/features/collaborations/ui-constants";

import { BRAND } from "@/config/brand";
export const metadata: Metadata = { title: `Messages · ${BRAND.wordmark}` };

type Props = { params: Promise<{ collaborationId: string }> };

export default async function CreatorThreadPage({ params }: Props) {
  const { collaborationId } = await params;
  const viewer = await getViewer();
  const scope = viewer && threadScopeFor(viewer);
  if (!viewer || !scope) redirect(`/login?next=/creator/messages/${collaborationId}`);
  const isBot = collaborationId === BOT_THREAD_ID;

  let data;
  try {
    data = await Promise.all([listThreads(scope), isBot ? null : getThread(scope, collaborationId)]);
  } catch (error) {
    console.error("[messages] creator thread failed", { collaborationId, creatorId: scope.ownerId, error });
    return <ErrorState body="We could not load this conversation. Try again in a moment." retryHref={`/creator/messages/${collaborationId}`} />;
  }
  const [threads, detail] = data;
  if (!isBot && !detail) notFound();

  return (
    <MessagesLayout threads={threads} role="creator" activeId={collaborationId}>
      {detail ? (
        <ThreadView
          detail={detail}
          role="creator"
          csrfToken={viewer.csrfToken}
          senderName={`${viewer.firstName} ${viewer.lastName}`.trim()}
          senderAvatarUrl={viewer.creator?.avatarUrl ?? null}
        />
      ) : (
        <BotThread role="creator" />
      )}
    </MessagesLayout>
  );
}
