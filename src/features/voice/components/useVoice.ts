"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useReducer, useRef } from "react";
import { INITIAL_VOICE_STATE, type VoiceState, voiceReducer } from "@/lib/voice-state";
import { NAVIGATE_DELAY_MS } from "../constants";
import type { VoiceIntent, VoiceResponse } from "../schemas";
import type { VoiceProvider, VoiceProviderEvents } from "../providers/types";
import { createWebSpeechProvider, isWebSpeechSupported } from "../providers/web-speech";
import { createVapiProvider } from "../providers/vapi";

type SessionInfo = { provider: "vapi"; assistantId: string; publicKey: string; voiceToken: string } | { provider: "web-speech" };

// Owns the pill's state machine. Web speech: mic → /api/voice/intent → speak
// the reply → (if "Confirm?") listen again for yes/no. Vapi: the call owns
// the turns; we only mirror transcripts into the UI.
export function useVoice(csrfToken: string) {
  const router = useRouter();
  const [state, dispatch] = useReducer(voiceReducer, INITIAL_VOICE_STATE);
  const providerRef = useRef<VoiceProvider | null>(null);
  const pendingRef = useRef<VoiceIntent | null>(null);
  const supported = typeof window === "undefined" ? true : isWebSpeechSupported();

  const stop = useCallback(() => {
    providerRef.current?.stop();
    providerRef.current = null;
    pendingRef.current = null;
    dispatch({ type: "stop" });
  }, []);

  const submit = useCallback(
    async (transcript: string) => {
      dispatch({ type: "final", text: transcript });
      const response = await sendTranscript({ transcript, pending: pendingRef.current, csrfToken });
      pendingRef.current = response.pending ?? null;
      dispatch({ type: "response", speech: response.speech, pending: response.pending, ok: response.ok });
      if (response.navigate) window.setTimeout(() => router.push(response.navigate as string), NAVIGATE_DELAY_MS);
      await providerRef.current?.speak(response.speech);
      dispatch({ type: "spoken" });
      if (response.pending) await providerRef.current?.start().catch((e: Error) => dispatch({ type: "fail", message: e.message }));
    },
    [csrfToken, router],
  );

  const start = useCallback(async () => {
    const events: VoiceProviderEvents = {
      onPartial: (text) => dispatch({ type: "partial", text }),
      onFinal: (text) => (providerRef.current?.handlesIntents ? void submit(text) : dispatch({ type: "final", text })),
      onError: (message) => dispatch({ type: "fail", message }),
      onAssistantSpeech: (speech) => dispatch({ type: "response", speech, ok: true }),
      onSpeakingEnd: () => dispatch({ type: "spoken" }),
    };
    try {
      providerRef.current = await pickProvider(events);
      dispatch({ type: "start" });
      await providerRef.current.start();
    } catch (error) {
      dispatch({ type: "fail", message: error instanceof Error ? error.message : "Couldn't start the microphone." });
    }
  }, [submit]);

  const toggle = useCallback(() => (state.status === "idle" || state.status === "error" ? void start() : stop()), [state.status, start, stop]);

  useEffect(() => () => providerRef.current?.stop(), []);

  return { state, supported, toggle, stop, submit } as { state: VoiceState; supported: boolean; toggle: () => void; stop: () => void; submit: (t: string) => Promise<void> };
}

async function pickProvider(events: VoiceProviderEvents): Promise<VoiceProvider> {
  const info = (await fetch("/api/voice/session", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)).catch(() => null)) as SessionInfo | null;
  if (info?.provider === "vapi") return createVapiProvider(info, events);
  return createWebSpeechProvider(events);
}

async function sendTranscript(input: { transcript: string; pending: VoiceIntent | null; csrfToken: string }): Promise<VoiceResponse> {
  try {
    const res = await fetch("/api/voice/intent", {
      method: "POST",
      headers: { "content-type": "application/json", "x-csrf-token": input.csrfToken },
      body: JSON.stringify({ transcript: input.transcript, pending: input.pending ?? undefined }),
    });
    const body = (await res.json()) as VoiceResponse;
    return { ...body, ok: res.ok && body.ok };
  } catch {
    return { ok: false, speech: "I couldn't reach the server. Try again." };
  }
}
