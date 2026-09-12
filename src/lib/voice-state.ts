// The floating pill's voice state machine. Pure, so it can be driven with
// synthetic transcripts in tests and by either provider at runtime.

export type VoiceStatus = "idle" | "listening" | "thinking" | "speaking" | "confirming" | "error";

export type VoiceState = {
  status: VoiceStatus;
  transcript: string; // streams in while listening
  speech: string; // last thing the assistant said
  pending: unknown | null; // gated intent awaiting yes/no
  error: string | null;
};

export type VoiceEvent =
  | { type: "start" }
  | { type: "stop" }
  | { type: "partial"; text: string }
  | { type: "final"; text: string }
  | { type: "response"; speech: string; pending?: unknown | null; ok: boolean }
  | { type: "spoken" }
  | { type: "fail"; message: string };

export const INITIAL_VOICE_STATE: VoiceState = { status: "idle", transcript: "", speech: "", pending: null, error: null };

export function voiceReducer(state: VoiceState, event: VoiceEvent): VoiceState {
  switch (event.type) {
    case "start":
      return { ...state, status: "listening", transcript: "", error: null };
    case "stop":
      return { ...state, status: "idle", transcript: "", pending: null };
    case "partial":
      return state.status === "listening" || state.status === "confirming" ? { ...state, transcript: event.text } : state;
    case "final":
      return { ...state, status: "thinking", transcript: event.text };
    case "response":
      return { ...state, status: "speaking", speech: event.speech, pending: event.pending ?? null, error: event.ok ? null : event.speech };
    case "spoken":
      // After a gated question we go straight back to listening for the yes/no.
      return state.pending ? { ...state, status: "confirming", transcript: "" } : { ...state, status: "idle", transcript: "" };
    case "fail":
      return { ...state, status: "error", error: event.message };
    default:
      return state;
  }
}
