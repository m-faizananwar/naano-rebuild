"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { TypingDots } from "@/components/motion/TypingDots";
import { PANEL_MAX_VH, PANEL_RADIUS } from "../constants";
import type { ChatMessage } from "../schemas";

type Props = { messages: ChatMessage[]; busy: boolean; onClose: () => void; onClear: () => void };

// The conversation above the pill: grows with content up to 60vh then
// scrolls. User messages are right-aligned grey pills, replies plain text.
export function ChatPanel({ messages, busy, onClose, onClear }: Props) {
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [messages, busy]);
  return (
    <section aria-label="Conversation" className="assistant-panel flex w-full flex-col overflow-hidden text-sm" style={{ borderRadius: PANEL_RADIUS, maxHeight: `${PANEL_MAX_VH}vh` }}>
      <div className="flex items-center justify-between px-4 pt-3 pb-1 text-xs text-muted-foreground">
        <button type="button" onClick={onClear} className="hover:text-foreground focus-visible:outline-none focus-visible:underline">Clear</button>
        <button type="button" onClick={onClose} aria-label="Close" className="rounded-full p-1 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"><X className="size-3.5" aria-hidden="true" /></button>
      </div>
      <ol className="flex flex-col gap-2 overflow-y-auto px-4 pb-4">
        {messages.map((m, i) => (
          <li key={i} className={m.role === "user" ? "self-end rounded-full bg-muted px-3.5 py-2 text-foreground" : "self-start pr-6 leading-relaxed text-foreground"}>
            {m.text}
          </li>
        ))}
        {busy ? <li className="self-start"><TypingDots label="Thinking" /></li> : null}
        <div ref={endRef} />
      </ol>
    </section>
  );
}
