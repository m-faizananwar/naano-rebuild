"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { drawPath } from "@/lib/motion/anime";

// Wraps a recharts chart (with its own animation off) and draws every
// rendered line path with anime once it is in the DOM. Re-runs when
// `replayKey` changes (a range switch).
type Props = { children: ReactNode; replayKey?: string | number; className?: string; role?: string; "aria-label"?: string };

export function DrawnChart({ children, replayKey, className, ...rest }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // recharts mounts its svg after a measure pass; wait one frame for the path
    let handle: { cancel: () => void } | null = null;
    const raf = requestAnimationFrame(() => {
      const paths = el.querySelectorAll<SVGPathElement>("path.recharts-line-curve, path.recharts-area-curve");
      paths.forEach((path, i) => { handle = drawPath(path, { delay: i * 120 }); });
    });
    return () => { cancelAnimationFrame(raf); handle?.cancel(); };
  }, [replayKey]);
  return <div ref={ref} className={className} {...rest}>{children}</div>;
}
