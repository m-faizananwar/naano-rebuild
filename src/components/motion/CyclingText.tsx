"use client";

import { useEffect, useState } from "react";

const DEFAULT_INTERVAL_MS = 4000;

// Cycles through phrases; each new one slides up with naano's localeIn.
export function CyclingText({ phrases, intervalMs = DEFAULT_INTERVAL_MS, className }: { phrases: readonly string[]; intervalMs?: number; className?: string }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % phrases.length), intervalMs);
    return () => clearInterval(id);
  }, [phrases.length, intervalMs]);
  return (
    <span className={className} aria-live="polite">
      <span key={index} className="inline-block animate-locale-in">
        {phrases[index]}
      </span>
    </span>
  );
}
