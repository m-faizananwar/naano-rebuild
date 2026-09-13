"use client";

import { BorderBeam } from "border-beam";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ThinkingOrb } from "thinking-orbs";
import { MESSAGE_STAGGER_S, PANEL_MAX_VH, PANEL_MIN_HEIGHT, PANEL_RADIUS, SPRINGS } from "../constants";
import type { ChatMessage } from "../schemas";

type Props = { messages: ChatMessage[]; busy: boolean; onClose: () => void; onClear: () => void };

// The conversation card: the pill's width, 8px above it, min 96px, grows with
// content to 60vh then scrolls inside. A thin mono beam rides its border only
// while the assistant works; thinking-orbs sit where the next reply lands.
export function ChatPanel({ messages, busy, onClose, onClear }: Props) {
  const endRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end", behavior: reduced ? "auto" : "smooth" });
  }, [messages, busy, reduced]);
  // Messages that arrive together stagger 40ms; a lone one pops at once.
  const [seen, setSeen] = useState(messages.length);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- remembers how many were already on screen
    setSeen(messages.length);
  }, [messages.length]);

  return (
    <BorderBeam size="line" colorVariant="mono" strength={0.35} theme="light" active={busy} className="w-full">
      <section
        aria-label="Conversation"
        className="assistant-glass flex w-full flex-col overflow-hidden text-foreground"
        style={{ borderRadius: PANEL_RADIUS, minHeight: PANEL_MIN_HEIGHT, maxHeight: `${PANEL_MAX_VH}vh` }}
      >
        <div className="assistant-ink60 flex items-center justify-between px-4 pt-3 pb-1 text-xs">
          <button type="button" onClick={onClear} className="hover:text-foreground focus-visible:outline-none focus-visible:underline">Clear</button>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-full p-1 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40">
            <X className="size-3.5" aria-hidden="true" />
          </button>
        </div>
        <ol className="flex flex-col gap-2 overflow-y-auto px-4 pb-4">
          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.li
                key={`${i}-${m.role}`}
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={reduced ? { duration: 0.2 } : { ...SPRINGS.message, delay: Math.max(0, i - seen) * MESSAGE_STAGGER_S }}
                style={{ transformOrigin: m.role === "user" ? "bottom right" : "bottom left" }}
                className={m.role === "user" ? "assistant-msg--user max-w-[78%] self-end" : "assistant-msg--assistant max-w-[78%] self-start"}
              >
                {m.text}
              </motion.li>
            ))}
          </AnimatePresence>
          {busy ? (
            <li className="self-start pl-0.5" aria-label="Thinking" role="status">
              <ThinkingOrb state="working" size={20} theme="light" />
            </li>
          ) : null}
          <div ref={endRef} />
        </ol>
      </section>
    </BorderBeam>
  );
}
