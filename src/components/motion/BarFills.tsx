"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { timeline } from "@/lib/motion/anime";

const EACH_MS = 60;
const FILL_MS = 520;

// Every `[data-fill]` descendant (a bar with its target width in the inline
// style) fills from 0 with a stagger. Replays when `replayKey` changes.
export function BarFills({ children, replayKey, className }: { children: ReactNode; replayKey?: string | number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const bars = Array.from(el.querySelectorAll<HTMLElement>("[data-fill]"));
    if (bars.length === 0) return;
    const handle = timeline(bars.map((bar, i) => ({ target: bar, props: { width: [0, bar.style.width || "0%"] }, duration: FILL_MS, at: i * EACH_MS })));
    return () => handle.cancel();
  }, [replayKey]);
  return <div ref={ref} className={className}>{children}</div>;
}
