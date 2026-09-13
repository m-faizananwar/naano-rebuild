"use client";

import { type RefObject, useEffect } from "react";
import { onSplashDone } from "../splash/splash-events";

const BLUR_PX = 18;
const WASH = "rgba(242, 240, 236, 0.55)";
const CANVAS_QUERY = "(min-width: 768px)";
// a blurred still: half the device pixels is indistinguishable and a quarter of the filter work
const PIXEL_RATIO = 0.5;
const NEAR = "150% 0px"; // arm within 1.5 viewports

type Refs = {
  section: RefObject<HTMLElement | null>;
  card: RefObject<HTMLElement | null>;
  container: RefObject<HTMLDivElement | null>;
  canvas: RefObject<HTMLCanvasElement | null>;
};

// The frame-sync module's static cousin (useGlassSync draws a video every
// frame): the section backdrop is drawn into the duplicate canvas once on
// mount and again on resize — same section-aligned registration, same filter,
// almost no runtime cost. Only from 768px: phones keep the chrome without the canvas.
export function useStaticGlass(refs: Refs, src: string | null) {
  useEffect(() => {
    const section = refs.section.current;
    const card = refs.card.current;
    const container = refs.container.current;
    const canvas = refs.canvas.current;
    const ctx = canvas?.getContext("2d");
    if (!src || !section || !card || !container || !canvas || !ctx) return;
    if (!window.matchMedia(CANVAS_QUERY).matches) return;

    const image = new Image();
    image.decoding = "async";
    let disposed = false;

    const draw = () => {
      if (disposed || !image.naturalWidth) return;
      const box = section.getBoundingClientRect();
      const rect = card.getBoundingClientRect();
      const cw = Math.round(box.width), ch = Math.round(box.height);
      container.style.left = `${box.left - rect.left}px`;
      container.style.top = `${box.top - rect.top}px`;
      container.style.width = `${cw}px`;
      container.style.height = `${ch}px`;
      const w = Math.round(cw * PIXEL_RATIO), h = Math.round(ch * PIXEL_RATIO);
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
      // object-fit: cover, blurred and washed like the section's own backdrop.
      const cover = Math.max(w / image.naturalWidth, h / image.naturalHeight);
      const sw = w / cover, sh = h / cover;
      const sx = (image.naturalWidth - sw) / 2, sy = (image.naturalHeight - sh) / 2;
      const b = BLUR_PX * PIXEL_RATIO;
      ctx.filter = `blur(${b}px)`;
      ctx.drawImage(image, sx, sy, sw, sh, -b, -b, w + b * 2, h + b * 2);
      ctx.filter = "none";
      ctx.fillStyle = WASH;
      ctx.fillRect(0, 0, w, h);
    };

    // A blurred full-section draw is expensive, and there are ~17 cards: never
    // on the critical path. Start after the splash, when the thread is idle, and
    // only once the card is near the viewport.
    let armed = false;
    const ro = new ResizeObserver(() => { if (armed) draw(); });
    const onResize = () => { if (armed) draw(); };
    const onSettle = () => { if (armed) draw(); };
    const arm = () => {
      if (armed || disposed) return;
      armed = true;
      image.onload = draw;
      image.src = src;
      ro.observe(section);
      ro.observe(card);
      window.addEventListener("resize", onResize);
      // The entrance translates the card, which ResizeObserver does not see: re-register when it settles.
      card.addEventListener("animationend", onSettle);
    };
    const io = new IntersectionObserver((entries) => { if (entries.some((e) => e.isIntersecting)) { io.disconnect(); arm(); } }, { rootMargin: NEAR });
    const idle = () => (typeof requestIdleCallback === "function" ? requestIdleCallback(() => io.observe(card), { timeout: 1500 }) : window.setTimeout(() => io.observe(card), 200));
    const offSplash = onSplashDone(idle);
    return () => { disposed = true; offSplash(); io.disconnect(); ro.disconnect(); window.removeEventListener("resize", onResize); card.removeEventListener("animationend", onSettle); };
    // refs are stable; run once after hydration
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);
}
