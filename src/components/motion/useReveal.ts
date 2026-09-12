"use client";

import { type RefObject, useEffect, useRef, useState } from "react";

const DEFAULT_THRESHOLD = 0.15;
const SETTLE_MS = 300;

function inView(node: HTMLElement, threshold: number) {
  const rect = node.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight;
  // Scrolled past (a jump via End or an anchor) counts as seen.
  if (rect.bottom < 0) return true;
  const visibleHeight = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
  return visibleHeight > 0 && visibleHeight / Math.min(rect.height, vh) >= threshold;
}

// Flips `visible` once the element scrolls into view, then stops watching.
// IntersectionObserver does the work; a passive scroll/resize check backs it
// up so a section can never stay hidden if the observer never fires.
export function useReveal<T extends HTMLElement>(threshold = DEFAULT_THRESHOLD): [RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let done = false;
    const reveal = () => {
      if (done) return;
      done = true;
      setVisible(true);
      cleanup();
    };
    const check = () => {
      if (inView(node, threshold)) reveal();
    };
    const observer =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && reveal(), { threshold });
    const cleanup = () => {
      observer?.disconnect();
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
    observer?.observe(node);
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    const settle = window.setTimeout(check, SETTLE_MS);
    return () => {
      window.clearTimeout(settle);
      cleanup();
    };
  }, [threshold]);
  return [ref, visible];
}
