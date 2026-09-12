import type { ReactNode } from "react";
import type { CampaignOption, ThreadDto, ViewerRole } from "../../schemas";
import { ThreadList } from "./ThreadList";

type Props = { threads: ThreadDto[]; role: ViewerRole; activeId: string | null; campaigns?: CampaignOption[]; children: ReactNode };

// Two panes: the thread list and whatever is open on the right. On small
// screens only one pane shows — the list, or the open thread.
export function MessagesLayout({ threads, role, activeId, campaigns = [], children }: Props) {
  const showingThread = activeId !== null;
  return (
    <div className="grid min-h-[calc(100vh-9rem)] overflow-hidden rounded-2xl border bg-background lg:grid-cols-[20rem_minmax(0,1fr)]">
      <aside className={`${showingThread ? "hidden lg:block" : "block"} border-r`}>
        <ThreadList threads={threads} role={role} activeId={activeId} campaigns={campaigns} />
      </aside>
      <section className={`${showingThread ? "flex" : "hidden lg:flex"} min-w-0 flex-col`}>{children}</section>
    </div>
  );
}
