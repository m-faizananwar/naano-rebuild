"use client";

import { usePathname } from "next/navigation";
import { type ReactNode, useLayoutEffect, useRef } from "react";
import { registerMorph } from "@/lib/motion/scroll-morph";

// Route-enter motion for the app shells (mounted from template.tsx, so it
// remounts on every client navigation): the page heading runs textReveal and
// the page's direct children — tiles, cards, tables as whole blocks — pop in
// on blovio's spring 80ms apart, one shot per visit. Blocks that already
// carry their own Reveal group are left to it. Opacity + transform only, so
// nothing shifts; reduced motion is instant (scroll-morph handles it).
export function RouteEnter({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const targets: HTMLElement[] = [];
    Array.from(root.children).forEach((child, i) => {
      const el = child as HTMLElement;
      if (el.hasAttribute("data-morph-group") || el.hasAttribute("data-morph")) return;
      const heading = i === 0 ? el.querySelector<HTMLElement>("h1") : null;
      if (heading) { heading.setAttribute("data-morph", "text"); targets.push(heading); return; }
      el.setAttribute("data-morph", "");
      targets.push(el);
    });
    return registerMorph(targets);
  }, [pathname]);
  return <div ref={ref} data-morph-group>{children}</div>;
}
