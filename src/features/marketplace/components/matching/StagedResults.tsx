"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { TypingDots } from "@/components/motion/TypingDots";
import { useReducedMotion } from "@/components/motion/useReducedMotion";

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
      {show ? <div className="animate-fade grid gap-3">{children}</div> : <TypingDots label="Nao is thinking" />}
    </>
  );
}
