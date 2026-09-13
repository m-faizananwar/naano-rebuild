"use client";

import { ChevronDown, MessageCircle } from "lucide-react";
import { Liquid } from "liquid-gooey";
import { type FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { CyclingText } from "@/components/motion/CyclingText";
import { VoiceMic } from "@/features/voice/components/VoiceMic";
import { BUBBLE_SIZE, EDGE_GAP, LIQUID, PHRASES, PHRASE_INTERVAL_MS, PILL_HEIGHT, PILL_WIDTH, STORAGE_KEYS } from "../constants";
import { ChatPanel } from "./ChatPanel";
import { SpinnerRing } from "./SpinnerRing";
import { useAssistantChat } from "./useAssistantChat";
import "./assistant.css";

type Props = { mode: "public" | "brand" | "creator"; csrfToken?: string };
type Shape = "pill" | "bubble";

function readCollapsed() {
  try {
    return localStorage.getItem(STORAGE_KEYS.collapsed) === "1";
  } catch {
    return false;
  }
}

// naano's floating assistant, bottom-centre on every page: a glass pill
// (spinner-ring glyph, cycling placeholder, mic), a chevron pill above it
// that collapses everything into a dark chat bubble bottom-right, and a
// chat panel that grows out of the pill when a message is sent. The four
// pieces are Liquid.Items in one liquid-gooey container, so the panel
// visibly grows out of the pill and the collapse flows into the bubble
// while the text on top stays crisp.
export function AssistantWidget({ mode, csrfToken }: Props) {
  const [shape, setShape] = useState<Shape>("pill");
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [travel, setTravel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const chat = useAssistantChat(csrfToken);

  // The bubble sits bottom-right: how far the pill travels from centre.
  useEffect(() => {
    const measure = () => setTravel(Math.max(0, window.innerWidth / 2 - EDGE_GAP - BUBBLE_SIZE / 2));
    measure();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial measurement + stored state
    setShape(readCollapsed() ? "bubble" : "pill");
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const collapse = useCallback(() => {
    setOpen(false);
    setShape("bubble");
    try {
      localStorage.setItem(STORAGE_KEYS.collapsed, "1");
    } catch {
      /* storage blocked */
    }
  }, []);
  const expand = useCallback(() => {
    setShape("pill");
    try {
      localStorage.removeItem(STORAGE_KEYS.collapsed);
    } catch {
      /* storage blocked */
    }
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
    setOpen(true);
    void chat.send(draft);
    setDraft("");
  };

  const bubble = shape === "bubble";
  const label = mode === "public" ? "Ask about the product" : "Ask the assistant";

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center" aria-live="polite">
      <Liquid
        blur={LIQUID.blur}
        contrast={LIQUID.contrast}
        fill={LIQUID.fill}
        shadow={LIQUID.shadow}
        filterPadding={48}
        className="flex w-full flex-col items-center justify-end"
        style={{ height: "calc(60vh + 120px)", paddingBottom: EDGE_GAP }}
      >
        {/* the chat panel, grown out of the pill */}
        {open && !bubble ? (
          <Liquid.Item morph={{ shape: true, contentBlur: 0 }} transition="bouncy" className="pointer-events-auto mb-1" style={{ width: PILL_WIDTH, maxWidth: "calc(100vw - 2rem)" }}>
            <ChatPanel messages={chat.messages} busy={chat.busy} onClose={() => setOpen(false)} onClear={chat.clear} />
          </Liquid.Item>
        ) : null}

        {/* the chevron pill: sits just above the bar, melts into it on collapse */}
        <Liquid.Item observe className="pointer-events-auto mb-1">
          <div className="assistant-blob rounded-full" style={{ transform: `translate(${bubble ? travel : 0}px, ${bubble ? PILL_HEIGHT : 0}px) scale(${bubble ? 0.4 : 1})` }}>
          <button
            type="button"
            onClick={open ? () => setOpen(false) : collapse}
            aria-label={open ? "Close the conversation" : "Hide the assistant"}
            className="flex h-6 w-9 items-center justify-center rounded-full text-muted-foreground transition-opacity hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
            style={{ opacity: bubble ? 0 : 1 }}
            tabIndex={bubble ? -1 : 0}
          >
            <ChevronDown className="size-3.5" aria-hidden="true" />
          </button>
          </div>
        </Liquid.Item>

        {/* the bar → the bubble: one item that changes shape and travels to the corner */}
        <Liquid.Item morph={{ shape: true, contentBlur: 0 }} className="pointer-events-auto">
          {/* one persistent element, moved by us (morph.shape observes its rect): the liquid follows */}
          <div className="assistant-blob rounded-full" style={{ transform: `translateX(${bubble ? travel : 0}px)` }}>
          {bubble ? (
            <button
              type="button"
              onClick={expand}
              aria-label="Open the assistant"
              className="flex items-center justify-center rounded-full bg-foreground text-background transition-colors hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
              style={{ width: BUBBLE_SIZE, height: BUBBLE_SIZE }}
            >
              <MessageCircle className="size-5" aria-hidden="true" />
            </button>
          ) : (
            <form onSubmit={submit} className="assistant-pill flex items-center gap-3 rounded-full pl-4 pr-1.5" style={{ width: PILL_WIDTH, maxWidth: "calc(100vw - 2rem)", height: PILL_HEIGHT }}>
              <span className="text-foreground/70"><SpinnerRing spinning={chat.busy} /></span>
              <span className="relative min-w-0 flex-1">
                {draft ? null : <CyclingText phrases={PHRASES} intervalMs={PHRASE_INTERVAL_MS} className="pointer-events-none absolute inset-0 flex items-center truncate text-sm text-muted-foreground" />}
                <input
                  ref={inputRef}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onFocus={() => chat.messages.length > 0 && setOpen(true)}
                  aria-label={label}
                  className="h-full w-full bg-transparent text-sm text-foreground outline-none"
                />
              </span>
              {csrfToken ? <VoiceMic csrfToken={csrfToken} /> : <button type="submit" aria-label="Send" className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-foreground hover:bg-muted/70"><SendGlyph /></button>}
            </form>
          )}
          </div>
        </Liquid.Item>
      </Liquid>
    </div>
  );
}

// naano's waveform glyph, used as the send affordance on the public site where there is no mic.
function SendGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true" className="size-4">
      <path d="M4 12h2M8 8v8M12 5v14M16 8v8M20 12h2" />
    </svg>
  );
}
