"use client";

import { type RefObject, useEffect } from "react";

const BLUR_PX = 18;
const WASH = "rgba(242, 240, 236, 0.55)";
const CANVAS_QUERY = "(min-width: 768px)";

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
      const w = Math.round(box.width), h = Math.round(box.height);
      container.style.left = `${box.left - rect.left}px`;
      container.style.top = `${box.top - rect.top}px`;
      container.style.width = `${w}px`;
      container.style.height = `${h}px`;
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
      // object-fit: cover, blurred and washed like the section's own backdrop.
      const cover = Math.max(w / image.naturalWidth, h / image.naturalHeight);
      const sw = w / cover, sh = h / cover;
      const sx = (image.naturalWidth - sw) / 2, sy = (image.naturalHeight - sh) / 2;
      ctx.filter = `blur(${BLUR_PX}px)`;
      ctx.drawImage(image, sx, sy, sw, sh, -BLUR_PX, -BLUR_PX, w + BLUR_PX * 2, h + BLUR_PX * 2);
      ctx.filter = "none";
      ctx.fillStyle = WASH;
      ctx.fillRect(0, 0, w, h);
    };

    image.onload = draw;
    image.src = src;
    const ro = new ResizeObserver(draw);
    ro.observe(section);
    ro.observe(card);
    window.addEventListener("resize", draw);
    // The entrance translates the card, which ResizeObserver does not see: re-register when it settles.
    card.addEventListener("animationend", draw);
    return () => { disposed = true; ro.disconnect(); window.removeEventListener("resize", draw); card.removeEventListener("animationend", draw); };
    // refs are stable; run once after hydration
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);
}
