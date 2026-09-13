"use client";

import { AnimatePresence, motion, useReducedMotion, useSpring } from "framer-motion";
import { Liquid } from "liquid-gooey";
import { ChevronDown, MessageCircle, Square } from "lucide-react";
import { MetalFx } from "metal-fx";
import { type FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { CyclingText } from "@/components/motion/CyclingText";
import {
  BUBBLE_SIZE, BUBBLE_TRAVEL_PADDING, EDGE_GAP, HAPTIC, LIQUID, MOTION, PANEL_GAP, PANEL_RADIUS, PHRASES, PHRASE_INTERVAL_MS, PILL_FOCUS_GROW,
  PILL_HEIGHT, PILL_WIDTH, PRESS_MS, PRESS_SCALE, SPRING_BEZIER, STORAGE_KEYS,
} from "../constants";
import { Beam } from "@/components/motion/Beam";
import { ChatPanel } from "./ChatPanel";
import { buzz } from "./haptics";
import { SpinnerRing } from "./SpinnerRing";
import { useAssistantChat } from "./useAssistantChat";
import { useSpeechInput } from "./useSpeechInput";
import "./assistant.css";

type Props = { mode: "public" | "brand" | "creator"; csrfToken?: string; autoVoice?: boolean };
// Where the panel morphs from/to: the pill (typing) or the dark bubble.
type Origin = "pill" | "bubble";

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

// naano's floating assistant: a column the pill's width, bottom-centre — the
// glass chat panel anchored to the pill's edges 8px above it, the chevron on
// the seam, and the pill. The pill and chevron are liquid-gooey items so the
// collapse flows into the dark bubble bottom-right. The panel is a morphing
// shell: width/height/translate on the spring curve (520ms), radius and
// colour on the ease (420ms), so the bubble visibly grows into the panel and
// shrinks back. Content fades/scales in from .94, staggered. Reduced motion: fades.
export function AssistantWidget({ mode, csrfToken, autoVoice = false }: Props) {
  const width = mode === "public" ? PILL_WIDTH.public : PILL_WIDTH.app;
  const reduced = useReducedMotion();
  const [bubble, setBubble] = useState(false);
  const [open, setOpen] = useState(false);
  const [origin, setOrigin] = useState<Origin>("pill");
  const [draft, setDraft] = useState("");
  const [focused, setFocused] = useState(false);
  const [pressed, setPressed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [travel, setTravel] = useState(0);
  const chat = useAssistantChat(csrfToken);
  const speech = useSpeechInput(
    {
      onPartial: (text) => setDraft(text),
      onFinal: (text) => {
        setDraft("");
        if (!open) setOrigin("pill");
        setOpen(true);
        buzz(HAPTIC.send);
        void chat.send(text);
      },
    },
    () => inputRef.current?.focus(),
  );
  const x = useSpring(0, reduced ? { duration: 0.2 } : { duration: 0.52, bounce: 0.35 });

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
    buzz(HAPTIC.close);
  }, []);
  // The bubble grows straight into the panel (no pill stop); the pill fades in underneath.
  const expandFromBubble = useCallback(() => {
    x.jump(0);
    setBubble(false);
    storeCollapsed(false);
    setOrigin("bubble");
    setOpen(true);
    buzz(HAPTIC.open);
  }, [x]);
  const closePanel = useCallback(() => {
    setOpen(false);
    buzz(HAPTIC.close);
    if (origin === "bubble") {
      // shrink back into the bubble: the pill hides while the shell travels
      setBubble(true);
      storeCollapsed(true);
    }
  }, [origin]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePanel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closePanel]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    setPressed(true);
    window.setTimeout(() => setPressed(false), PRESS_MS);
    if (!open) {
      setOrigin("pill");
      buzz(HAPTIC.open);
    } else buzz(HAPTIC.send);
    setOpen(true);
    void chat.send(draft);
    setDraft("");
  };

  const listening = speech.status !== "idle";
  const label = mode === "public" ? "Ask about the product" : "Ask the assistant";
  const fade = { duration: 0.2 };
  // A click on the static shell's mic mounts the widget with autoVoice: start listening once.
  const autoStarted = useRef(false);
  useEffect(() => {
    if (!autoVoice || autoStarted.current) return;
    autoStarted.current = true;
    speech.toggle();
    // once, on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoVoice]);
  const pillWidth = Math.min(width, typeof window === "undefined" ? width : window.innerWidth - 2 * EDGE_GAP);

  // The shell's bubble geometry, in the panel's own coordinate space: the
  // bubble sits bottom-right, one pill + gap below the panel's bottom edge.
  const bubbleShell = {
    width: BUBBLE_SIZE,
    height: BUBBLE_SIZE,
    borderRadius: BUBBLE_SIZE / 2,
    x: travel + (pillWidth - BUBBLE_SIZE) / 2,
    y: PILL_HEIGHT + PANEL_GAP,
    opacity: 1,
    backgroundColor: "rgba(13, 12, 11, 1)",
  };
  const panelShell = { width: pillWidth, height: "auto", borderRadius: PANEL_RADIUS, x: 0, y: 0, opacity: 1, backgroundColor: "rgba(255, 255, 255, 0.72)" };
  const pillShell = { width: pillWidth, height: 0, borderRadius: PANEL_RADIUS, x: 0, y: 12, opacity: 0, backgroundColor: "rgba(255, 255, 255, 0.72)" };
  const from = origin === "bubble" ? bubbleShell : pillShell;
  const shellTransition = reduced
    ? fade
    : { width: MOTION.morph, height: MOTION.morph, x: MOTION.morph, y: MOTION.morph, borderRadius: MOTION.radius, backgroundColor: MOTION.radius, opacity: MOTION.fadeIn };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center" style={{ paddingBottom: EDGE_GAP }} aria-live="polite">
      <div className="flex flex-col items-center" style={{ width, maxWidth: "calc(100vw - 2rem)" }}>
        <AnimatePresence initial={false}>
          {open ? (
            <motion.div
              key="panel"
              className="assistant-glass pointer-events-auto overflow-hidden"
              style={{ transformOrigin: origin === "bubble" ? "bottom right" : "bottom center", marginBottom: PANEL_GAP, alignSelf: "flex-start" }}
              initial={reduced ? { ...panelShell, opacity: 0 } : from}
              animate={panelShell}
              exit={reduced ? { ...panelShell, opacity: 0, transition: fade } : { ...from, transition: shellTransition }}
              transition={shellTransition}
            >
              {/* laid out at the shell's target width, so growing the shell reveals it rather than reflowing it */}
              <div style={{ width: pillWidth }}>
                <ChatPanel messages={chat.messages} busy={chat.busy} onClose={closePanel} onClear={chat.clear} />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <Liquid blur={LIQUID.blur} contrast={LIQUID.contrast} fill={LIQUID.fill} shadow={LIQUID.shadow} filterPadding={BUBBLE_TRAVEL_PADDING} className="flex w-full flex-col items-center">
          {/* chevron on the 8px seam (no layout height); flows into the bar on collapse */}
          <Liquid.Item observe className="pointer-events-auto">
            <motion.div className="relative z-10 -my-3 rounded-full" style={{ x }} animate={{ y: bubble ? PILL_HEIGHT + PANEL_GAP : 0, scale: bubble ? 0.4 : 1, opacity: bubble ? 0 : 1 }} transition={reduced ? fade : MOTION.morph}>
              <button
                type="button"
                onClick={open ? closePanel : collapse}
                aria-label={open ? "Close the conversation" : "Hide the assistant"}
                className="assistant-ink60 chat-hover-lift flex h-6 w-9 items-center justify-center rounded-full hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
                tabIndex={bubble ? -1 : 0}
              >
                <motion.span className="flex" animate={{ rotate: open ? 180 : 0 }} transition={reduced ? fade : MOTION.morph}>
                  <ChevronDown className="size-3.5" aria-hidden="true" />
                </motion.span>
              </button>
            </motion.div>
          </Liquid.Item>

          {/* the bar ↔ the bubble: one element the liquid observes, moved on the spring */}
          <Liquid.Item morph={{ shape: true, contentBlur: 0 }} className="pointer-events-auto">
            <motion.div className="rounded-full" style={{ x }} animate={{ opacity: open && origin === "bubble" && bubble ? 0 : 1 }} transition={reduced ? fade : MOTION.fadeIn}>
              {bubble ? (
                <motion.button
                  type="button"
                  onClick={expandFromBubble}
                  aria-label="Open the assistant"
                  className="assistant-bubble chat-hover-lift flex items-center justify-center rounded-full text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
                  style={{ width: BUBBLE_SIZE, height: BUBBLE_SIZE }}
                  initial={reduced ? { opacity: 0 } : { scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={reduced ? fade : MOTION.morph}
                >
                  <MessageCircle className="size-5" aria-hidden="true" />
                </motion.button>
              ) : (
                <motion.form
                  onSubmit={submit}
                  className="assistant-pill relative flex items-center gap-3 rounded-full pl-4 pr-1.5"
                  style={{ maxWidth: "calc(100vw - 2rem)" }}
                  initial={reduced ? { opacity: 0 } : { scale: 0.9, opacity: 0 }}
                  animate={{
                    opacity: 1,
                    width: pillWidth + (focused ? PILL_FOCUS_GROW.width : 0),
                    height: PILL_HEIGHT + (focused ? PILL_FOCUS_GROW.height : 0),
                    scale: pressed ? PRESS_SCALE : 1,
                  }}
                  transition={reduced ? fade : pressed ? { duration: PRESS_MS / 1000 } : { ...MOTION.morph, opacity: { ...MOTION.fadeIn, delay: origin === "bubble" ? 0.12 : 0 } }}
                >
                  <Beam size="line" strength={0.28} className="absolute inset-0 rounded-full" aria-hidden="true"><span className="block h-full w-full rounded-full" /></Beam>
                  <span key={chat.busy ? "busy" : "idle"} className="assistant-ink60 chat-swap relative"><SpinnerRing spinning={chat.busy} /></span>
                  <span className="relative z-10 min-w-0 flex-1">
                    {draft ? null : listening ? (
                      <span className="pointer-events-none absolute inset-0 flex items-center truncate text-sm text-muted-foreground">{speech.status === "call" ? "On a call…" : "Listening…"}</span>
                    ) : (
                      <CyclingText phrases={PHRASES} intervalMs={PHRASE_INTERVAL_MS} className="pointer-events-none absolute inset-0 flex items-center truncate text-sm text-muted-foreground" />
                    )}
                    <input
                      ref={inputRef}
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onFocus={() => { setFocused(true); if (chat.messages.length > 0 && !open) { setOrigin("pill"); setOpen(true); } }}
                      onBlur={() => setFocused(false)}
                      aria-label={label}
                      className="h-full w-full bg-transparent text-sm text-foreground outline-none"
                    />
                  </span>
                  <MetalFx variant="circle" preset="silver" theme="light" strength={listening ? 0.55 : 0.22}>
                    <button
                      type="button"
                      onClick={speech.toggle}
                      aria-label={listening ? (speech.status === "call" ? "Hang up" : "Stop listening") : "Talk to the assistant"}
                      aria-pressed={listening}
                      data-status={speech.status}
                      className="chat-hover-send flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-foreground data-[status=listening]:bg-brand data-[status=listening]:text-brand-foreground data-[status=call]:bg-brand data-[status=call]:text-brand-foreground"
                    >
                      <span key={speech.status} className="chat-swap flex items-center justify-center">
                        {listening ? <Square className="size-3" aria-hidden="true" /> : <SendGlyph />}
                      </span>
                    </button>
                  </MetalFx>
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
