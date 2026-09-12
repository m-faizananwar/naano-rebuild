"use client";

import { type RefObject, useEffect } from "react";

// The duplicate is sized to the video's on-screen box (the viewport, while
// the hero is pinned) rather than to the card on purpose: the filter shifts
// each colour channel by a different amount, so the filtered element's own
// leading edges show hard channel-separation bands. At that size those bands
// fall outside the card and only clean refraction shows.
//
// It stays at 1× even on retina: the SVG filter's cost scales with pixel
// count, and what shows through is a soft refraction where 4× the filter work
// buys nothing.
const DUP_PIXEL_RATIO = 1;

type Refs = {
  video: RefObject<HTMLVideoElement | null>;
  card: RefObject<HTMLElement | null>;
  container: RefObject<HTMLDivElement | null>;
  canvas: RefObject<HTMLCanvasElement | null>;
};

// Frame sync (glass-card.js in the standalone): every rAF, re-align the
// duplicate to the video's box and redraw the current frame with object-fit
// cover; the SVG filter on the canvas refracts it on composite. Measuring the
// video's rect (transforms included) instead of the viewport keeps the copy
// registered with the hero's scaled, sticky video.
export function useGlassSync(refs: Refs) {
  useEffect(() => {
    const video = refs.video.current;
    const card = refs.card.current;
    const container = refs.container.current;
    const canvas = refs.canvas.current;
    const ctx = canvas?.getContext("2d");
    if (!video || !card || !container || !canvas || !ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let lastW = 0, lastH = 0, rafId = 0;
    const frame = () => {
      rafId = requestAnimationFrame(frame);
      const rect = card.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      if (!video.videoWidth || !video.videoHeight) return;
      const box = video.getBoundingClientRect();
      const vw = box.width, vh = box.height;
      // Absolutely positioned inside the card, so this offset lands the copy
      // exactly over the video's box: pixels line up 1:1 with the real video.
      // The card's overflow:hidden + radius do the clipping.
      container.style.left = `${box.left - rect.left}px`;
      container.style.top = `${box.top - rect.top}px`;
      container.style.width = `${vw}px`;
      container.style.height = `${vh}px`;
      const w = Math.round(vw * DUP_PIXEL_RATIO), h = Math.round(vh * DUP_PIXEL_RATIO);
      if (w !== lastW || h !== lastH) { canvas.width = w; canvas.height = h; lastW = w; lastH = h; }
      // Reproduce object-fit: cover.
      const cover = Math.max(vw / video.videoWidth, vh / video.videoHeight);
      const sw = vw / cover, sh = vh / cover;
      const sx = (video.videoWidth - sw) / 2, sy = (video.videoHeight - sh) / 2;
      try { ctx.drawImage(video, sx, sy, sw, sh, 0, 0, w, h); } catch { /* a frame may not be decodable yet */ }
    };
    rafId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafId);
    // refs are stable; run once after hydration
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
