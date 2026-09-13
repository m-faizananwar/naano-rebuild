"use client";

import { Beam } from "@/components/motion/Beam";
import { motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ThinkingOrb } from "thinking-orbs";
import { LAYER_STAGGER_MS, MESSAGE_STAGGER_S, MOTION, PANEL_MAX_VH, PANEL_MIN_HEIGHT } from "../constants";
import type { ChatMessage } from "../schemas";

type Props = { messages: ChatMessage[]; busy: boolean; onClose: () => void; onClear: () => void };

// The conversation inside the morphing shell. Its content fades and scales
// in from .94, staggered per element (header, then the list); each message
// pops (chatPop) on the spring curve; the "assistant is typing" row bounces
// with chatDot timing around the thinking orbs; a thin mono beam rides the
// border only while the assistant works.
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

  const layer = (i: number) => ({
    initial: reduced ? { opacity: 0 } : { opacity: 0, scale: 0.94 },
    animate: { opacity: 1, scale: 1 },
    transition: reduced
      ? { duration: 0.2 }
      : { opacity: { ...MOTION.fadeIn, delay: (i * LAYER_STAGGER_MS) / 1000 }, scale: { ...MOTION.scaleIn, delay: (i * LAYER_STAGGER_MS) / 1000 } },
  });

  return (
    <Beam size="line" strength={busy ? 0.8 : 0.45} className="w-full">
      <section aria-label="Conversation" className="flex w-full flex-col overflow-hidden text-foreground" style={{ minHeight: PANEL_MIN_HEIGHT, maxHeight: `${PANEL_MAX_VH}vh` }}>
        <motion.div {...layer(1)} className="assistant-ink60 flex items-center justify-between px-4 pt-3 pb-1 text-xs">
          <button type="button" onClick={onClear} className="hover:text-foreground focus-visible:outline-none focus-visible:underline">Clear</button>
          <button type="button" onClick={onClose} aria-label="Close" className="chat-hover-x rounded-full p-1 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40">
            <X className="size-3.5" aria-hidden="true" />
          </button>
        </motion.div>
        <motion.ol {...layer(2)} className="flex flex-col gap-2 overflow-y-auto px-4 pb-4">
          {messages.map((m, i) => (
            <motion.li
              key={`${i}-${m.role}`}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={reduced ? { duration: 0.2 } : { ...MOTION.pop, delay: Math.max(0, i - seen) * MESSAGE_STAGGER_S }}
              style={{ transformOrigin: m.role === "user" ? "bottom right" : "bottom left" }}
              className={m.role === "user" ? "assistant-msg--user max-w-[78%] self-end" : "assistant-msg--assistant max-w-[78%] self-start"}
            >
              {m.text}
            </motion.li>
          ))}
          {busy ? (
            <li className="chat-dot self-start pl-0.5" aria-label="Thinking" role="status">
              <ThinkingOrb state="working" size={20} theme="light" />
            </li>
          ) : null}
          <div ref={endRef} />
        </motion.ol>
      </section>
    </Beam>
  );
}
