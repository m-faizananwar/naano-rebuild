"use client";

import { useEffect, useState } from "react";
import { enter, exit } from "@/lib/motion/anime";

// Enter/exit for a controlled Dialog or Sheet through anime: the popup's own
// data-state animation is turned off by the caller (animate-none /
// transition-none), the content enters when it mounts, and a close request
// plays the exit before the parent is asked to flip `open`.
export function useMotionDialog(onOpenChange: (open: boolean) => void, opts: { axis?: "x" | "y"; distance?: number } = {}) {
  const [el, setEl] = useState<HTMLElement | null>(null);
  const [closing, setClosing] = useState(false);
  useEffect(() => {
    if (!el) return;
    const handle = enter(el, opts);
    return () => handle.cancel();
    // opts is a literal at the call site; the enter runs once per mounted popup
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [el]);
  const handleOpenChange = (open: boolean) => {
    if (open) { onOpenChange(true); return; }
    if (closing) return;
    setClosing(true);
    exit(el, opts).finished.then(() => { onOpenChange(false); setClosing(false); });
  };
  return { attachContent: setEl, handleOpenChange };
}
