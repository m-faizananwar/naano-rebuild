"use client";

import { cn } from "cn";
import type React from "react";
import type { ReactNode } from "react";
import { useReveal } from "./useReveal";

type Props = { children: ReactNode; className?: string; as?: "div" | "section" | "li" };

// Wraps a landing section: hidden until scrolled into view, then naano's .reveal transition.
export function Reveal({ children, className, as = "div" }: Props) {
  const [ref, visible] = useReveal<HTMLDivElement>();
  const classes = cn("reveal", visible && "is-visible", className);
  // One element type per branch keeps the ref typing honest; the observer only needs an HTMLElement.
  if (as === "section") return <section ref={ref as React.RefObject<HTMLElement | null>} className={classes}>{children}</section>;
  if (as === "li") return <li ref={ref as React.RefObject<HTMLLIElement | null>} className={classes}>{children}</li>;
  return <div ref={ref} className={classes}>{children}</div>;
}
