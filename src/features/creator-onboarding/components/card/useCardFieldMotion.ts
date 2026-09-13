"use client";

import { type RefObject, useEffect } from "react";
import { timeline } from "@/lib/motion/anime";

const FLIP_MS = 420;
const SLIDE_MS = 380;

// A small anime timeline on every field change of the live card: stat cells
// flip on their x axis, the industry line slides in. The 3D card flip itself
// stays CSS. `signature` changes whenever a watched field changes.
export function useCardFieldMotion(root: RefObject<HTMLElement | null>, signature: string) {
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const stats = Array.from(el.querySelectorAll<HTMLElement>("[data-stat]"));
    const line = el.querySelector<HTMLElement>("[data-industries]");
    const handle = timeline([
      ...stats.map((stat, i) => ({ target: stat, props: { rotateX: [-90, 0], opacity: [0, 1] }, duration: FLIP_MS, at: i * 60 })),
      ...(line ? [{ target: line, props: { translateX: [-12, 0], opacity: [0, 1] }, duration: SLIDE_MS, at: 0 }] : []),
    ]);
    return () => handle.cancel();
  }, [root, signature]);
}
