"use client";

import { AnimatePresence, motion, useReducedMotion, useSpring } from "framer-motion";
import { Liquid } from "liquid-gooey";
import { ChevronDown, MessageCircle } from "lucide-react";
import { MetalFx } from "metal-fx";
import { type FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { CyclingText } from "@/components/motion/CyclingText";
import { VoiceMic } from "@/features/voice/components/VoiceMic";
import type { VoiceState } from "@/lib/voice-state";
import {
  BUBBLE_SIZE, BUBBLE_TRAVEL_PADDING, EDGE_GAP, LIQUID, PANEL_GAP, PHRASES, PHRASE_INTERVAL_MS, PILL_FOCUS_GROW, PILL_HEIGHT, PILL_WIDTH,
  PRESS_MS, PRESS_SCALE, SPRINGS, STORAGE_KEYS,
} from "../constants";
import { ChatPanel } from "./ChatPanel";
import { SpinnerRing } from "./SpinnerRing";
import { useAssistantChat } from "./useAssistantChat";
import "./assistant.css";

type Props = { mode: "public" | "brand" | "creator"; csrfToken?: string };

function readCollapsed() {
  try {
    return localStorage.getItem(STORAGE_KEYS.collapsed) === "1";
  } catch {
    return false;
  }
}
function storeCollapsed(on: boolean) {
  try {
    if (on) localStorage.setItem(STORAGE_KEYS.collapsed, "1");
    else localStorage.removeItem(STORAGE_KEYS.collapsed);
  } catch {
    /* storage blocked */
  }
}

// naano's floating assistant: a column the pill's width, bottom-centre —
// the glass chat panel (anchored to the pill's edges, 8px above), the
// chevron, and the pill. The pill and chevron are liquid-gooey items so the
// collapse flows into the dark bubble bottom-right on a spring; everything
// else is framer-motion springs, all interruptible. Reduced motion: fades.
export function AssistantWidget({ mode, csrfToken }: Props) {
  const width = mode === "public" ? PILL_WIDTH.public : PILL_WIDTH.app;
  const reduced = useReducedMotion();
  const [bubble, setBubble] = useState(false);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [focused, setFocused] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [voice, setVoice] = useState<VoiceState["status"]>("idle");
  const [travel, setTravel] = useState(0);
  const chat = useAssistantChat(csrfToken);
  const x = useSpring(0, reduced ? { duration: 0.2 } : SPRINGS.bubble);

  useEffect(() => {
    const measure = () => setTravel(Math.max(0, window.innerWidth / 2 - EDGE_GAP - BUBBLE_SIZE / 2));
    measure();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial measurement + stored state
    setBubble(readCollapsed());
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);
  useEffect(() => {
    x.set(bubble ? travel : 0);
  }, [bubble, travel, x]);

  const collapse = useCallback(() => {
    setOpen(false);
    setFocused(false);
    setBubble(true);
    storeCollapsed(true);
  }, []);
  const expand = useCallback(() => {
    setBubble(false);
    storeCollapsed(false);
  }, []);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    setPressed(true);
    window.setTimeout(() => setPressed(false), PRESS_MS);
    setOpen(true);
    void chat.send(draft);
    setDraft("");
  };

  const listening = voice === "listening" || voice === "confirming";
  const label = mode === "public" ? "Ask about the product" : "Ask the assistant";
  const fade = { duration: 0.2 };
  const micRing = useCallback(
    (button: React.ReactNode) => (
      <MetalFx variant="circle" preset="silver" theme="light" strength={listening ? 0.55 : 0.22}>
        {button}
      </MetalFx>
    ),
    [listening],
  );

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center" style={{ paddingBottom: EDGE_GAP }} aria-live="polite">
      <div className="flex flex-col items-center" style={{ width, maxWidth: "calc(100vw - 2rem)" }}>
        <AnimatePresence initial={false}>
          {open && !bubble ? (
            <motion.div
              key="panel"
              className="pointer-events-auto w-full overflow-hidden"
              style={{ transformOrigin: "bottom center", marginBottom: PANEL_GAP }}
              initial={reduced ? { opacity: 0 } : { height: 0, opacity: 0, y: 12 }}
              animate={{ height: "auto", opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 0, transition: fade } : { height: 0, opacity: 0, y: 12, transition: SPRINGS.close }}
              transition={reduced ? fade : SPRINGS.open}
            >
              <ChatPanel messages={chat.messages} busy={chat.busy} onClose={() => setOpen(false)} onClear={chat.clear} />
            </motion.div>
          ) : null}
        </AnimatePresence>

        <Liquid blur={LIQUID.blur} contrast={LIQUID.contrast} fill={LIQUID.fill} shadow={LIQUID.shadow} filterPadding={BUBBLE_TRAVEL_PADDING} className="flex w-full flex-col items-center">
          {/* chevron, centred on the 8px seam between the panel and the pill (takes no
              layout height); flows into the bar on collapse */}
          <Liquid.Item observe className="pointer-events-auto">
            <motion.div className="relative z-10 -my-3 rounded-full" style={{ x }} animate={{ y: bubble ? PILL_HEIGHT + PANEL_GAP : 0, scale: bubble ? 0.4 : 1, opacity: bubble ? 0 : 1 }} transition={reduced ? fade : SPRINGS.bubble}>
              <button
                type="button"
                onClick={open ? () => setOpen(false) : collapse}
                aria-label={open ? "Close the conversation" : "Hide the assistant"}
                className="assistant-ink60 flex h-6 w-9 items-center justify-center rounded-full hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
                tabIndex={bubble ? -1 : 0}
              >
                <motion.span className="flex" animate={{ rotate: open ? 180 : 0 }} transition={reduced ? fade : SPRINGS.open}>
                  <ChevronDown className="size-3.5" aria-hidden="true" />
                </motion.span>
              </button>
            </motion.div>
          </Liquid.Item>

          {/* the bar ↔ the bubble: one element the liquid observes, moved on a spring */}
          <Liquid.Item morph={{ shape: true, contentBlur: 0 }} className="pointer-events-auto">
            <motion.div className="rounded-full" style={{ x }}>
              {bubble ? (
                <motion.button
                  type="button"
                  onClick={expand}
                  aria-label="Open the assistant"
                  className="assistant-bubble flex items-center justify-center rounded-full text-background hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
                  style={{ width: BUBBLE_SIZE, height: BUBBLE_SIZE }}
                  initial={reduced ? { opacity: 0 } : { scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={reduced ? fade : SPRINGS.pop}
                >
                  <MessageCircle className="size-5" aria-hidden="true" />
                </motion.button>
              ) : (
                <motion.form
                  onSubmit={submit}
                  className="assistant-pill flex items-center gap-3 rounded-full pl-4 pr-1.5"
                  style={{ maxWidth: "calc(100vw - 2rem)" }}
                  initial={reduced ? { opacity: 0 } : { scale: 0.9, opacity: 0 }}
                  animate={{
                    opacity: 1,
                    width: Math.min(width, typeof window === "undefined" ? width : window.innerWidth - 2 * EDGE_GAP) + (focused ? PILL_FOCUS_GROW.width : 0),
                    height: PILL_HEIGHT + (focused ? PILL_FOCUS_GROW.height : 0),
                    scale: pressed ? PRESS_SCALE : 1,
                  }}
                  transition={reduced ? fade : pressed ? { duration: PRESS_MS / 1000 } : SPRINGS.open}
                >
                  <span className="assistant-ink60"><SpinnerRing spinning={chat.busy} /></span>
                  <span className="relative min-w-0 flex-1">
                    {draft ? null : <CyclingText phrases={PHRASES} intervalMs={PHRASE_INTERVAL_MS} className="pointer-events-none absolute inset-0 flex items-center truncate text-sm text-muted-foreground" />}
                    <input
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onFocus={() => { setFocused(true); if (chat.messages.length > 0) setOpen(true); }}
                      onBlur={() => setFocused(false)}
                      aria-label={label}
                      className="h-full w-full bg-transparent text-sm text-foreground outline-none"
                    />
                  </span>
                  {csrfToken ? (
                    <VoiceMic csrfToken={csrfToken} wrap={micRing} onStatusChange={setVoice} />
                  ) : (
                    <MetalFx variant="circle" preset="silver" theme="light" strength={0.22}>
                      <button type="submit" aria-label="Send" className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-foreground hover:bg-muted/70"><SendGlyph /></button>
                    </MetalFx>
                  )}
                </motion.form>
              )}
            </motion.div>
          </Liquid.Item>
        </Liquid>
      </div>
    </div>
  );
}

// naano's waveform glyph, the send affordance on the public site where there is no mic.
function SendGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true" className="size-4">
      <path d="M4 12h2M8 8v8M12 5v14M16 8v8M20 12h2" />
    </svg>
  );
}
