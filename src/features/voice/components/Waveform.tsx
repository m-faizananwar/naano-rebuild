import { WAVEFORM_BARS } from "../constants";

// Five bars that pulse while listening and ripple while speaking; still otherwise.
export function Waveform({ mode }: { mode: "listening" | "speaking" | "thinking" | "idle" }) {
  return (
    <span className="flex h-4 items-end gap-0.5" aria-hidden="true" data-mode={mode}>
      {Array.from({ length: WAVEFORM_BARS }, (_, i) => (
        <span
          key={i}
          className="voice-bar w-0.5 rounded-full bg-current"
          style={{ animationDelay: `${i * 90}ms` }}
        />
      ))}
    </span>
  );
}
