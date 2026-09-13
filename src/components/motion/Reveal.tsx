"use client";

import { cn } from "cn";
import type React from "react";
import { type ReactNode, useEffect, useRef } from "react";
import { reducedMotion, stagger } from "@/lib/motion/anime";
import { useReveal } from "./useReveal";

type Props = { children: ReactNode; className?: string; as?: "div" | "section" | "li" };
const REVEAL_MS = 640;
const REVEAL_Y = 18;
const CHILD_EACH_MS = 60;

// A landing section or a dashboard block: hidden until it first scrolls into
// view, then anime (via src/lib/motion/anime) brings it in — opacity 0→1,
// translateY 18→0 over 640ms on the .16,1,.3,1 curve, direct children
// staggered 60ms. Once. Reduced motion: shown, no motion.
export function Reveal({ children, className, as = "div" }: Props) {
  const [ref, visible] = useReveal<HTMLDivElement>();
  const played = useRef(false);
  useEffect(() => {
    const node = ref.current;
    if (!visible || !node || played.current) return;
    played.current = true;
    node.style.opacity = "1";
    // a single wrapped grid: stagger its items instead of the wrapper
    const only = node.children.length === 1 ? node.children[0] : null;
    const targets = node.children.length > 1 ? node.children : only && only.children.length > 1 ? only.children : [node];
    const handle = stagger(targets, { each: CHILD_EACH_MS, y: REVEAL_Y, duration: REVEAL_MS });
    return () => handle.cancel();
  }, [visible, ref]);
  // Hidden until revealed (inline so there is no flash before hydration); reduced motion never hides.
  const style: React.CSSProperties | undefined = visible || (typeof window !== "undefined" && reducedMotion()) ? undefined : { opacity: 0 };
  const classes = cn("reveal-anime", className);
  if (as === "section") return <section ref={ref as React.RefObject<HTMLElement | null>} className={classes} style={style}>{children}</section>;
  if (as === "li") return <li ref={ref as React.RefObject<HTMLLIElement | null>} className={classes} style={style}>{children}</li>;
  return <div ref={ref} className={classes} style={style}>{children}</div>;
}
