"use client";

import { useEffect, useRef } from "react";
import { INK_POSTER, INK_VIDEO } from "./footer-links";

const NEAR = "60% 0px";
// referrerpolicy is valid on <video> but missing from React's typings
const NO_REFERRER = { referrerPolicy: "no-referrer" } as Record<string, string>;

// The footer clip. The landing already streams several videos above it, so
// this one waits until the footer is near the viewport, then loads and plays
// explicitly (autoplay alone was left paused at 0 on the long page). Poster
// and clip carry no referrer, and the poster is also painted as the wrapper's
// background so the landscape shows before the clip decodes. While the bottom
// row is on screen, <html data-footer-row> lets fixed elements move out of its way.
export function FooterMedia() {
  const wrap = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = wrap.current, v = video.current;
    if (!el || !v) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      if (reduced) return;
      if (v.readyState === 0) v.load();
      v.play().catch(() => undefined); // keep the poster if autoplay is refused
    }, { rootMargin: NEAR });
    io.observe(el);
    const row = el.parentElement?.querySelector(".footer-bottom");
    const rowIo = row ? new IntersectionObserver((entries) => {
      const visible = entries.some((e) => e.isIntersecting);
      if (visible) document.documentElement.dataset.footerRow = ""; else delete document.documentElement.dataset.footerRow;
    }) : null;
    if (row) rowIo?.observe(row);
    return () => { io.disconnect(); rowIo?.disconnect(); delete document.documentElement.dataset.footerRow; };
  }, []);

  return (
    <div ref={wrap} className="footer-media" aria-hidden="true" style={{ backgroundImage: `url("${INK_POSTER}")`, backgroundSize: "cover", backgroundPosition: "center bottom" }}>
      <video ref={video} className="footer-bg" muted loop playsInline preload="metadata" poster={INK_POSTER} {...NO_REFERRER}>
        <source src={INK_VIDEO} type="video/mp4" />
      </video>
    </div>
  );
}
