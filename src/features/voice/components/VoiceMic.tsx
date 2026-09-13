"use client";

import { Mic, MicOff, Square } from "lucide-react";
import { type ReactNode, useEffect } from "react";
import type { VoiceState } from "@/lib/voice-state";
import { useVoice } from "./useVoice";
import { Waveform } from "./Waveform";

const LABELS = {
  idle: "Tap to talk",
  listening: "Listening…",
  thinking: "Thinking…",
  speaking: "Speaking…",
  confirming: "Say yes or no",
  error: "Try again",
} as const;

// Mic button for the floating pill. Renders the streaming transcript and the
// assistant's last reply above the pill (the pill row is position:relative).
type Props = {
  csrfToken: string;
  // Lets a host dress the button (the assistant pill's metal ring) and follow the state.
  wrap?: (button: ReactNode) => ReactNode;
  onStatusChange?: (status: VoiceState["status"]) => void;
};

export function VoiceMic({ csrfToken, wrap, onStatusChange }: Props) {
  const { state, supported, toggle } = useVoice(csrfToken);
  useEffect(() => {
    onStatusChange?.(state.status);
  }, [state.status, onStatusChange]);
  const active = state.status !== "idle";
  const waveMode = state.status === "listening" || state.status === "confirming" ? "listening" : state.status === "speaking" ? "speaking" : state.status === "thinking" ? "thinking" : "idle";
  const caption = state.status === "speaking" || state.status === "confirming" || state.status === "error" ? (state.error ?? state.speech) : state.transcript;
  return (
    <>
      {active && (caption || state.status === "listening") ? (
        <div
          role="status"
          aria-live="polite"
          data-status={state.status}
          className="animate-locale-in absolute bottom-full left-1/2 mb-2 w-max max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-2xl border bg-background/95 px-4 py-2 text-sm shadow-lg backdrop-blur data-[status=error]:text-destructive sm:max-w-sm"
        >
          <span className="mr-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">{LABELS[state.status]}</span>
          <span className="voice-transcript">{caption || "…"}</span>
        </div>
      ) : null}
      {(wrap ?? ((b: ReactNode) => b))(
      <button
        type="button"
        onClick={toggle}
        disabled={!supported}
        aria-label={active ? "Stop voice" : "Talk to the assistant"}
        aria-pressed={active}
        data-status={state.status}
        title={supported ? LABELS[state.status] : "Voice needs Chrome or Safari"}
        className="chat-hover-send flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 disabled:opacity-50 data-[status=listening]:bg-brand data-[status=listening]:text-brand-foreground data-[status=confirming]:bg-brand data-[status=confirming]:text-brand-foreground data-[status=speaking]:bg-brand/20 data-[status=speaking]:text-brand data-[status=thinking]:bg-brand/20 data-[status=thinking]:text-brand"
      >
        <span key={state.status} className="chat-swap flex items-center justify-center">
          {!supported ? <MicOff className="size-4" aria-hidden="true" /> : state.status === "idle" || state.status === "error" ? <Mic className="size-4" aria-hidden="true" /> : state.status === "listening" || state.status === "confirming" ? <Waveform mode={waveMode} /> : state.status === "thinking" ? <Waveform mode="thinking" /> : <Square className="size-3" aria-hidden="true" />}
        </span>
      </button>
      )}
    </>
  );
}
