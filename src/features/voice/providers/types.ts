// A provider owns the microphone and the speaker. The hook owns the state
// machine and the intent round-trip, so providers stay thin.
export type VoiceProviderEvents = {
  onPartial: (text: string) => void;
  onFinal: (text: string) => void;
  onError: (message: string) => void;
  // Vapi speaks its own replies and reports them; web speech is silent here.
  onAssistantSpeech?: (text: string) => void;
  onSpeakingEnd?: () => void;
};

export type VoiceProvider = {
  name: "web-speech" | "vapi";
  start: () => Promise<void>;
  stop: () => void;
  // Speak a reply; resolves when done. Vapi ignores it (the assistant already spoke).
  speak: (text: string) => Promise<void>;
  // Whether the app should call /api/voice/intent itself. Vapi calls our webhook instead.
  handlesIntents: boolean;
};
