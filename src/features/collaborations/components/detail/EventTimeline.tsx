"use client";

import { useEffect, useRef } from "react";
import { eventLabel } from "@/lib/collaboration-labels";
import { formatDateTime } from "@/lib/dates";
import { drawPath, stagger } from "@/lib/motion/anime";
import type { CollaborationEventDto } from "../../schemas";
import { StatusBadge } from "../table/StatusBadge";

const EVENT_EACH_MS = 90;
const CONNECTOR_MS = 700;

// Every collaboration_events row, oldest first: who did what, when. The
// connector draws top to bottom and each event pops in in sequence (anime,
// through src/lib/motion/anime — reduced motion shows the end state).
export function EventTimeline({ events }: { events: CollaborationEventDto[] }) {
  const list = useRef<HTMLOListElement>(null);
  const line = useRef<SVGLineElement>(null);
  useEffect(() => {
    const items = list.current?.querySelectorAll<HTMLElement>("[data-event]") ?? [];
    const drawn = drawPath(line.current, { duration: CONNECTOR_MS });
    const popped = stagger(items, { each: EVENT_EACH_MS, y: 8 });
    return () => { drawn.cancel(); popped.cancel(); };
  }, [events.length]);

  return (
    <section className="rounded-2xl border bg-background p-5">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Timeline</h2>
      <div className="relative mt-4">
        {events.length > 1 ? (
          <svg className="pointer-events-none absolute top-1.5 bottom-3 left-[4px] w-px overflow-visible" aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 1 100">
            <line ref={line} x1="0.5" y1="0" x2="0.5" y2="100" stroke="var(--color-border)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          </svg>
        ) : null}
        <ol ref={list} className="space-y-4">
          {events.map((e, i) => (
            <li key={e.id} data-event className="relative flex gap-3 pl-5">
              <span aria-hidden="true" className={`absolute top-1.5 left-0 size-2.5 rounded-full ${i === events.length - 1 ? "bg-brand" : "bg-border"}`} />
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
      </div>
    </section>
  );
}
