"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { AssistantShell } from "./AssistantShell";

const AssistantWidget = dynamic(() => import("./AssistantWidget").then((m) => m.AssistantWidget), { ssr: false });

type Props = { mode: "public" | "brand" | "creator"; csrfToken?: string };
const NEAR_PX = 120;
const FALLBACK_MS = 4000;

// The static shell renders first; the interactive widget (framer-motion,
// liquid-gooey, border-beam, thinking-orbs, metal-fx, the chat client) is a
// separate chunk that loads on the first of: idle after load, the pointer
// within 120px of the pill, focus reaching it, or 4s — and swaps in place.
export function AssistantMount({ mode, csrfToken }: Props) {
  const [live, setLive] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let done = false;
    const go = () => {
      if (done) return;
      done = true;
      setLive(true);
    };
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    const afterLoad = () => (idle ? idle(go, { timeout: FALLBACK_MS }) : window.setTimeout(go, 0));
    if (document.readyState === "complete") afterLoad();
    else window.addEventListener("load", afterLoad, { once: true });
    const timer = window.setTimeout(go, FALLBACK_MS);
    const near = (e: PointerEvent) => {
      const pill = root.current?.querySelector(".assistant-shell-pill");
      if (!pill) return;
      const r = pill.getBoundingClientRect();
      const dx = Math.max(r.left - e.clientX, 0, e.clientX - r.right);
      const dy = Math.max(r.top - e.clientY, 0, e.clientY - r.bottom);
      if (Math.hypot(dx, dy) < NEAR_PX) go();
    };
    window.addEventListener("pointermove", near, { passive: true });
    const onFocus = () => go();
    root.current?.addEventListener("focusin", onFocus);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pointermove", near);
      window.removeEventListener("load", afterLoad);
      root.current?.removeEventListener("focusin", onFocus);
    };
  }, []);

  if (live) return <AssistantWidget mode={mode} csrfToken={csrfToken} />;
  return (
    <div ref={root}>
      <AssistantShell mode={mode} />
    </div>
  );
}
