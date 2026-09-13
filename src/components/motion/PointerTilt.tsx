"use client";

import { useEffect } from "react";

const TILT_DEG = 3;
const SHIFT_PX = 4;
const EASE_MS = 250;
const SELECTOR = ".frost-card, .glass-tilt, .group\\/button.bg-primary";
// the animatable owns `transform` while hovered, so the buttons' css lift (-2px) is folded in here
const BUTTON_LIFT_PX = -2;

type Animatable = { x: (v: number) => unknown; y: (v: number) => unknown; rotate: (v: number) => unknown; revert: () => void };

// Pointer-following micro-motion on the landing glass cards and the primary
// buttons: an anime `animatable` per element (x/y/rotate at 250ms ease),
// ≤3° and ≤4px toward the cursor, snapping back on leave. Delegated from
// one listener; anime is imported on first pointer entry, never at paint.
export function PointerTilt() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !window.matchMedia("(hover: hover)").matches) return;
    const live = new WeakMap<Element, Animatable>();
    let factory: ((el: Element) => Animatable) | null = null;
    const load = () => import("animejs").then(({ createAnimatable }) => {
      factory = (el) => createAnimatable(el as HTMLElement, { x: EASE_MS, y: EASE_MS, rotate: EASE_MS, ease: "outQuad" }) as unknown as Animatable;
    });
    const onMove = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest(SELECTOR);
      if (!el || !factory) return;
      let a = live.get(el);
      if (!a) { a = factory(el); live.set(el, a); }
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      const lift = el.classList.contains("group/button") ? BUTTON_LIFT_PX : 0;
      a.x(Math.max(-1, Math.min(1, dx)) * SHIFT_PX);
      a.y(Math.max(-1, Math.min(1, dy)) * SHIFT_PX + lift);
      a.rotate(Math.max(-1, Math.min(1, dx)) * TILT_DEG);
    };
    const onOut = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest(SELECTOR);
      if (!el || (e.relatedTarget instanceof Node && el.contains(e.relatedTarget))) return;
      const a = live.get(el);
      if (a) { a.x(0); a.y(0); a.rotate(0); }
    };
    const onFirst = () => { load(); document.removeEventListener("pointerover", onFirst); };
    document.addEventListener("pointerover", onFirst, { once: true, passive: true });
    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerout", onOut, { passive: true });
    return () => { document.removeEventListener("pointermove", onMove); document.removeEventListener("pointerout", onOut); document.removeEventListener("pointerover", onFirst); };
  }, []);
  return null;
}
