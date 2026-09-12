import { eventLabel } from "@/lib/collaboration-labels";
import { formatDateTime } from "@/lib/dates";
import type { CollaborationEventDto } from "../../schemas";
import { StatusBadge } from "../table/StatusBadge";

// Every collaboration_events row, oldest first: who did what, when.
export function EventTimeline({ events }: { events: CollaborationEventDto[] }) {
  return (
    <section className="rounded-2xl border bg-background p-5">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Timeline</h2>
      <ol className="mt-4 space-y-4">
        {events.map((e, i) => (
          <li key={e.id} className="relative flex gap-3 pl-5">
            <span
              aria-hidden="true"
              className={`absolute top-1.5 left-0 size-2.5 rounded-full ${i === events.length - 1 ? "bg-brand" : "bg-border"}`}
            />
            {i < events.length - 1 ? <span aria-hidden="true" className="absolute top-4 left-[4px] h-[calc(100%+0.5rem)] w-px bg-border" /> : null}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="font-medium">{eventLabel(e.event, e.actor, e.fromStatus)}</span>
                <StatusBadge status={e.toStatus} />
              </div>
              <p className="text-xs text-muted-foreground">
                <time dateTime={e.createdAt}>{formatDateTime(e.createdAt)}</time>
              </p>
              {e.note ? <blockquote className="mt-1 rounded-lg border-l-2 border-brand/40 bg-muted/50 px-3 py-2 text-sm">{e.note}</blockquote> : null}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
