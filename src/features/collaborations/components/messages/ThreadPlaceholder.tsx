import { MessageCircle } from "lucide-react";

// Right pane before a conversation is picked.
export function ThreadPlaceholder({ hasThreads }: { hasThreads: boolean }) {
  return (
    <>
      <header className="border-b px-6 py-4">
        <h2 className="font-semibold">Messages</h2>
        <p className="text-sm text-muted-foreground">Select a conversation</p>
      </header>
      <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center text-sm text-muted-foreground">
        <MessageCircle className="size-6" aria-hidden="true" />
        {hasThreads ? "Pick a thread on the left." : "No conversations yet."}
      </div>
    </>
  );
}
