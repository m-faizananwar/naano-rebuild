"use client";

import { useEffect, useRef } from "react";
import { countUp } from "@/lib/motion/anime";

const NUMBER = /-?[\d.,]*\d/;

// Counts the numeric part of a preformatted stat ("€8,810.00", "132,608",
// "12%") from 0 to its value, keeping prefix, suffix and decimal places.
export function AnimatedStat({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    const match = NUMBER.exec(value);
    if (!el || !match) return;
    const raw = match[0];
    const decimals = raw.includes(".") ? raw.length - raw.lastIndexOf(".") - 1 : 0;
    const to = Number(raw.replace(/,/g, ""));
    if (!Number.isFinite(to)) return;
    const prefix = value.slice(0, match.index);
    const suffix = value.slice(match.index + raw.length);
    const format = (n: number) => `${prefix}${n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`;
    const handle = countUp(el, to, { format });
    return () => handle.cancel();
  }, [value]);
  return <span ref={ref} className={className}>{value}</span>;
}
