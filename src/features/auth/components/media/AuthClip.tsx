"use client";

import { type CSSProperties, useEffect, useRef } from "react";

// The auth panel's clip: the poster paints with the page; the clip (a ~1MB 8s
// loop in public/media) is attached and played only after the window has
// loaded, so it never competes with the form's own chunks.
export function AuthClip({ src, poster, className, style }: { src: string; poster: string; className?: string; style?: CSSProperties }) {
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    let cancelled = false;
    const attach = () => {
      if (cancelled || v.src) return;
      v.src = src;
      v.load();
      v.play().catch(() => undefined);
    };
    if (document.readyState === "complete") attach();
    else window.addEventListener("load", attach, { once: true });
    return () => { cancelled = true; window.removeEventListener("load", attach); };
  }, [src]);
  return <video ref={video} className={className} style={style} muted loop playsInline preload="none" poster={poster} />;
}
