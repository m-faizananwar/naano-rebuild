import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ErrorState } from "@/components/page/ErrorState";
import { getViewer } from "@/features/auth/server/session";
import { MessagesLayout } from "@/features/collaborations/components/messages/MessagesLayout";
import { ThreadPlaceholder } from "@/features/collaborations/components/messages/ThreadPlaceholder";
import { listThreads, threadScopeFor } from "@/features/collaborations/server/messages-queries";
import { listBrandCampaignOptions } from "@/features/collaborations/server/queries";

import { BRAND } from "@/config/brand";
export const metadata: Metadata = { title: `Messages · ${BRAND.wordmark}` };

export default async function BrandMessagesPage() {
  const viewer = await getViewer();
  const scope = viewer && threadScopeFor(viewer);
  if (!scope) redirect("/login?next=/brand/messages");

  let data;
  try {
    data = await Promise.all([listThreads(scope), listBrandCampaignOptions(scope.ownerId)]);
  } catch (error) {
    console.error("[messages] brand list failed", { brandId: scope.ownerId, error });
    return <ErrorState body="We could not load your messages. Try again in a moment." retryHref="/brand/messages" />;
  }
  const [threads, campaigns] = data;

  return (
    <MessagesLayout threads={threads} role="brand" activeId={null} campaigns={campaigns}>
      <ThreadPlaceholder hasThreads={threads.length > 0} />
    </MessagesLayout>
  );
}
