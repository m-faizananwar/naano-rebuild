"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAssistantChat } from "../useAssistantChat";
import { isWebSpeechSupported } from "@/features/voice/providers/web-speech";
import { useSpeechInput } from "../useSpeechInput";

const SPEECH_RATE = 1.05;
const RESTART_MS = 250;

// The audio loop: continuous recognition (auto-restart after every final
// result) → the same chat.send / intent route as the pill (the confirm gate
// still applies: "yes" answers it) → the reply spoken with speechSynthesis;
// while it speaks, recognition is paused so it doesn't hear itself.
export function useCallLoop(csrfToken: string | undefined, active: boolean) {
  const chat = useAssistantChat(csrfToken);
  const [muted, setMuted] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [partial, setPartial] = useState("");
  const spoken = useRef(0);
  const speech = useSpeechInput(
    { onPartial: setPartial, onFinal: (text) => { setPartial(""); void chat.send(text); } },
    () => undefined,
  );
  const { status, fault, start, cancel } = speech;

  // speak each new assistant reply
  useEffect(() => {
    const last = chat.messages[chat.messages.length - 1];
    if (!last || last.role !== "assistant" || chat.messages.length === spoken.current) return;
    spoken.current = chat.messages.length;
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(last.text);
    u.rate = SPEECH_RATE;
    const voice = window.speechSynthesis.getVoices().find((v) => v.lang.startsWith("en"));
    if (voice) u.voice = voice;
    u.onstart = () => setSpeaking(true);
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    cancel();
    window.speechSynthesis.speak(u);
  }, [chat.messages, cancel]);

  // keep listening while the call is up, quiet and not speaking
  useEffect(() => {
    if (!active || muted || speaking || chat.busy || fault || status !== "idle" || !isWebSpeechSupported()) return;
    const t = window.setTimeout(() => void start(), RESTART_MS);
    return () => window.clearTimeout(t);
  }, [active, muted, speaking, chat.busy, fault, status, start]);

  useEffect(() => {
    if (!active) return;
    return () => {
      cancel();
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, [active, cancel]);

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      if (!m) cancel();
      return !m;
    });
  }, [cancel]);

  return { chat, muted, toggleMute, speaking, partial, listening: status === "listening", fault };
}
