"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const TRICKLE_MS = 180;
const TRICKLE_STEP = 8;
const TRICKLE_MAX = 88;
const EXIT_MS = 200;
const FULL = 100;

// 2px ink bar at the top of the viewport: starts on a click of an internal
// link (before the router does anything), trickles, completes when the
// pathname changes (the new route has painted), exits over 200ms.
export function RouteProgress() {
  const pathname = usePathname();
  const [value, setValue] = useState<number | null>(null);
  const trickle = useRef(0);
  const exit = useRef(0);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest("a[href]");
      if (!a || a.getAttribute("target") === "_blank" || a.hasAttribute("download")) return;
      const url = new URL((a as HTMLAnchorElement).href, location.href);
      if (url.origin !== location.origin || (url.pathname === location.pathname && url.hash)) return;
      window.clearTimeout(exit.current);
      setValue(TRICKLE_STEP);
      window.clearInterval(trickle.current);
      trickle.current = window.setInterval(() => setValue((v) => (v === null ? v : Math.min(TRICKLE_MAX, v + TRICKLE_STEP))), TRICKLE_MS);
    };
    document.addEventListener("click", onClick, true);
    return () => { document.removeEventListener("click", onClick, true); window.clearInterval(trickle.current); };
  }, []);

  // The route painted: run to 100, then let the bar fade out.
  useEffect(() => {
    window.clearInterval(trickle.current);
    exit.current = window.setTimeout(() => setValue((v) => (v === null ? v : FULL)), 0);
    const done = window.setTimeout(() => setValue(null), EXIT_MS * 2);
    return () => { window.clearTimeout(exit.current); window.clearTimeout(done); };
  }, [pathname]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5">
      <div
        className="h-full origin-left bg-foreground transition-[transform,opacity] ease-[cubic-bezier(.16,1,.3,1)]"
        style={{ transform: `scaleX(${(value ?? FULL) / FULL})`, opacity: value === null ? 0 : 1, transitionDuration: value === null ? `${EXIT_MS}ms` : `${TRICKLE_MS}ms` }}
      />
    </div>
  );
}
