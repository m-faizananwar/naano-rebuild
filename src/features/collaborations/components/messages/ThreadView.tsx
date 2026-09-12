"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { startTransition, useEffect, useOptimistic, useRef } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { MessageDto, ThreadDetailDto, ViewerRole } from "../../schemas";
import { sendMessage } from "../../server/messages-actions";
import { StatusBadge } from "../table/StatusBadge";
import { Composer } from "./Composer";
import { MessageBubble } from "./MessageBubble";

type Props = { detail: ThreadDetailDto; role: ViewerRole; csrfToken: string; senderName: string; senderAvatarUrl: string | null };

type Pending = MessageDto & { pending: true };

export function ThreadView({ detail, role, csrfToken, senderName, senderAvatarUrl }: Props) {
  const { thread, messages } = detail;
  // Sent messages appear at once; React drops them again if the action fails.
  const [optimistic, addOptimistic] = useOptimistic<Array<MessageDto | Pending>, Pending>(messages, (list, m) => [...list, m]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [optimistic.length]);

  function send({ body }: { body: string }) {
    startTransition(async () => {
      addOptimistic({ id: `pending-${Date.now()}`, body, senderName, senderAvatarUrl, mine: true, createdAt: new Date().toISOString(), pending: true });
      const result = await sendMessage({ collaborationId: thread.collaborationId, body, csrfToken });
      if (!result.ok) toast.error(result.error);
    });
  }

  return (
    <>
      <header className="flex items-center gap-3 border-b px-4 py-3">
        <Link href={`/${role}/messages`} className="lg:hidden" aria-label="Back to all messages">
          <ArrowLeft className="size-5" aria-hidden="true" />
        </Link>
        <Avatar>
          {thread.counterpartAvatarUrl ? <AvatarImage src={thread.counterpartAvatarUrl} alt="" /> : null}
          <AvatarFallback className="bg-foreground text-background">{thread.counterpartInitial}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-semibold">{thread.counterpartName}</h2>
          <p className="truncate text-xs text-muted-foreground">{thread.campaignName}</p>
        </div>
        <StatusBadge status={thread.status} />
        <Link href={`/${role}/collaborations/${thread.collaborationId}`} className="hidden text-sm font-medium text-brand hover:underline sm:block">
          Open collaboration
        </Link>
      </header>
      <ul className="flex-1 space-y-4 overflow-y-auto p-4">
        {optimistic.length === 0 ? <li className="py-10 text-center text-sm text-muted-foreground">No messages yet. Say hello.</li> : null}
        {optimistic.map((m) => (
          <MessageBubble key={m.id} message={m} pending={"pending" in m} />
        ))}
        <div ref={bottomRef} />
      </ul>
      <Composer disabled={false} onSend={send} />
    </>
  );
}
