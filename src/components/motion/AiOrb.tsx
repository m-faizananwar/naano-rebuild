"use client";

import { ThinkingOrb } from "thinking-orbs";
import { useReducedMotion } from "./useReducedMotion";

type Props = { state?: "working" | "searching" | "solving" | "listening" | "composing"; size?: 20 | 64; label?: string; className?: string };

// The loading state for every AI action: thinking-orbs sized to the button or
// panel, frozen under reduced motion. Light theme — the app is light.
export function AiOrb({ state = "working", size = 20, label = "Working", className }: Props) {
  const reduced = useReducedMotion();
  return (
    <span role="status" aria-label={label} className={className} style={{ display: "inline-flex", width: size, height: size }}>
      <ThinkingOrb state={state} size={size} theme="light" paused={reduced} />
    </span>
  );
}
