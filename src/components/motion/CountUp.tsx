"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";

type Format = "int" | "eur" | "percent";
type Props = { value: number; format?: Format; duration?: number; className?: string; locale?: string };

const DEFAULT_DURATION_MS = 300;
const CENTS = 100;

function render(value: number, format: Format, locale: string) {
  if (format === "eur") return new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }).format(value / CENTS);
  if (format === "percent") return `${Math.round(value)}%`;
  return Math.round(value).toLocaleString(locale);
}

// Counts from 0 to `value` on first paint; jumps straight to the end state under reduced motion.
export function CountUp({ value, format = "int", duration = DEFAULT_DURATION_MS, className, locale = "en-US" }: Props) {
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(0);
  const frame = useRef<number | null>(null);
  useEffect(() => {
    if (reduced) return;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setShown(value * eased);
      if (t < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [value, duration, reduced]);
  // Under reduced motion the end state is rendered directly, no counting.
  return <span className={className}>{render(reduced ? value : shown, format, locale)}</span>;
}
