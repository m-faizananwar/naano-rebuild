"use client";

import { type RefObject, useEffect } from "react";

// The duplicate covers the card plus a margin wider than the filter's reach
// (displacement scale 65 + blur 45), not the whole viewport: the filtered
// element's leading edges still show their channel-separation bands, but they
// fall outside the card, and the filter rasterises ~3× fewer pixels — which is
// what keeps the hero scrub at frame rate.
const MARGIN_PX = 96;
// The filter (three displacement passes + a 45px blur) rasterises every time the
// canvas changes; during a scrub that would be every seek. Redraws are capped at
// 20 fps so the scroll itself keeps its frame rate; at rest nothing redraws.
const MIN_REDRAW_MS = 50;
// It stays at 1× even on retina: the SVG filter's cost scales with pixel count,
// and what shows through is a soft refraction where 4× the work buys nothing.
const DUP_PIXEL_RATIO = 1;

type Refs = {
  video: RefObject<HTMLVideoElement | null>;
  card: RefObject<HTMLElement | null>;
  container: RefObject<HTMLDivElement | null>;
  canvas: RefObject<HTMLCanvasElement | null>;
};

// Frame sync (glass-card.js in the standalone): re-align the duplicate to the
// video's box and redraw the current frame with object-fit cover; the SVG
// filter on the canvas refracts it on composite. Redraws happen when a video
// frame paints (requestVideoFrameCallback) plus a rAF pass for layout changes,
// so an idle hero costs nothing.
export function useGlassSync(refs: Refs) {
  useEffect(() => {
    const video = refs.video.current;
    const card = refs.card.current;
    const container = refs.container.current;
    const canvas = refs.canvas.current;
    const ctx = canvas?.getContext("2d");
    if (!video || !card || !container || !canvas || !ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let lastW = 0, lastH = 0, rafId = 0, disposed = false, dirty = true, lastKey = "", lastDraw = 0;
    const draw = () => {
      if (dirty && performance.now() - lastDraw < MIN_REDRAW_MS) return; // throttled: stays dirty, drawn on a later tick
      const rect = card.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      if (!video.videoWidth || !video.videoHeight) return;
      const box = video.getBoundingClientRect();
      // region = card ∪ margin, clipped to the video box
      const left = Math.max(box.left, rect.left - MARGIN_PX), top = Math.max(box.top, rect.top - MARGIN_PX);
      const right = Math.min(box.right, rect.right + MARGIN_PX), bottom = Math.min(box.bottom, rect.bottom + MARGIN_PX);
      const rw = right - left, rh = bottom - top;
      if (rw <= 0 || rh <= 0) return;
      const key = `${left}|${top}|${rw}|${rh}|${box.width}|${box.height}`;
      if (!dirty && key === lastKey) return;
      dirty = false; lastKey = key; lastDraw = performance.now();
      container.style.left = `${left - rect.left}px`;
      container.style.top = `${top - rect.top}px`;
      container.style.width = `${rw}px`;
      container.style.height = `${rh}px`;
      const w = Math.round(rw * DUP_PIXEL_RATIO), h = Math.round(rh * DUP_PIXEL_RATIO);
      if (w !== lastW || h !== lastH) { canvas.width = w; canvas.height = h; lastW = w; lastH = h; }
      // object-fit: cover, then the sub-rectangle that sits under the region
      const cover = Math.max(box.width / video.videoWidth, box.height / video.videoHeight);
      const offX = (box.width - video.videoWidth * cover) / 2, offY = (box.height - video.videoHeight * cover) / 2;
      const sx = (left - box.left - offX) / cover, sy = (top - box.top - offY) / cover;
      try { ctx.drawImage(video, sx, sy, rw / cover, rh / cover, 0, 0, w, h); } catch { /* a frame may not be decodable yet */ }
    };
    const onFrame = () => { if (disposed) return; dirty = true; video.requestVideoFrameCallback(onFrame); };
    if ("requestVideoFrameCallback" in video) video.requestVideoFrameCallback(onFrame);
    const tick = () => { if (disposed) return; if (!("requestVideoFrameCallback" in video)) dirty = true; draw(); rafId = requestAnimationFrame(tick); };
    rafId = requestAnimationFrame(tick);
    return () => { disposed = true; cancelAnimationFrame(rafId); };
    // refs are stable; run once after hydration
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
