"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { AiOrb } from "@/components/motion/AiOrb";
import { useReducedMotion } from "@/components/motion/useReducedMotion";

import { BRAND } from "@/config/brand";
const THINKING_MS = 2000;

type Props = { intro: string; children: React.ReactNode };

// "Got it — I'm searching…" first, a typing indicator for ~2s, then the answer fades in.
export function StagedResults({ intro, children }: Props) {
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (reduced) return;
    const id = window.setTimeout(() => setReady(true), THINKING_MS);
    return () => window.clearTimeout(id);
  }, [reduced]);
  const show = reduced || ready;
  return (
    <>
      <p className="text-muted-foreground">{intro}</p>
      {show ? <div className="animate-fade grid gap-3">{children}</div> : <span className="inline-flex items-center gap-2 text-sm text-muted-foreground"><AiOrb state="searching" label={`${BRAND.copilot} is thinking`} /> {BRAND.copilot} is searching…</span>}
    </>
  );
}
