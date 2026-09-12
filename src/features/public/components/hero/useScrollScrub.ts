"use client";

import { type RefObject, useEffect, useState } from "react";
import {
  ATTACH_TIMEOUT_MS, CUES, DRIFT, HERO_VIDEO_BYTES, HERO_VIDEO_URL, PRELOAD_BAIL_MS, SEEK_EASE, SEEK_EPSILON,
} from "./hero-config";

type Refs = {
  wrapper: RefObject<HTMLElement | null>;
  clip: RefObject<HTMLVideoElement | null>;
  meter: RefObject<HTMLElement | null>;
  bootBar: RefObject<HTMLElement | null>;
  bootPct: RefObject<HTMLParagraphElement | null>;
  panels: RefObject<Array<HTMLElement | null>>;
};

export type HeroStatus = "loading" | "ready" | "static";

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
const smooth = (t: number) => t * t * (3 - 2 * t);
const ramp = (p: number, a: number, b: number) => (b <= a ? (p >= b ? 1 : 0) : smooth(clamp((p - a) / (b - a), 0, 1)));

// The standalone hero's IIFE (public/hero/index.html) as a hook. Same
// mechanics, three changes for living inside a page: progress is measured
// within the wrapper instead of the document, the meter is the hero's own,
// and reduced motion / a failed video leave the poster and the first panel.
export function useScrollScrub(refs: Refs): HeroStatus {
  const [status, setStatus] = useState<HeroStatus>("loading");

  useEffect(() => {
    const clip = refs.clip.current;
    const wrapper = refs.wrapper.current;
    if (!clip || !wrapper) return;
    const scrub = createScrub({ clip, wrapper, refs, onStatus: setStatus });
    return scrub.dispose;
    // refs are stable objects; the effect runs once after hydration.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return status;
}

type ScrubInput = { clip: HTMLVideoElement; wrapper: HTMLElement; refs: Refs; onStatus: (s: HeroStatus) => void };

function createScrub({ clip, wrapper, refs, onStatus }: ScrubInput) {
  let progress = 0, seekTo = 0, seekAt = 0, duration = 0, ready = false;
  let started = false, attached = false, disposed = false, failed = false;
  let rafId = 0;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Progress = scroll within the wrapper: 0 when its top hits the viewport top,
  // 1 when its bottom meets the viewport bottom (the sticky stage's last frame).
  function readScroll() {
    const rect = wrapper.getBoundingClientRect();
    const max = rect.height - window.innerHeight;
    progress = max > 0 ? clamp(-rect.top / max, 0, 1) : 0;
    if (duration) seekTo = progress * duration;
  }

  function paint() {
    if (refs.meter.current) refs.meter.current.style.transform = `scaleX(${progress})`;
    refs.panels.current.forEach((el, i) => {
      const c = CUES[i];
      if (!el || !c) return;
      const enter = ramp(progress, c[0], c[1]);
      const leave = ramp(progress, c[2], c[3]);
      const o = enter * (1 - leave);
      const y = (1 - enter) * DRIFT - leave * DRIFT;
      el.style.opacity = String(o);
      el.style.transform = `translate3d(0,${y}px,0)`;
      el.style.pointerEvents = o > 0.6 ? "auto" : "none";
    });
  }

  // Easing currentTime toward the scroll target (rather than snapping) is what
  // turns a jumpy scrub into a smooth one.
  function stepSeek() {
    if (!ready || !duration) return;
    const gap = seekTo - seekAt;
    if (Math.abs(gap) <= SEEK_EPSILON) return;
    seekAt += gap * SEEK_EASE;
    if (clip.readyState < 2 || clip.seeking) return;
    try { clip.currentTime = seekAt; } catch { /* not seekable yet */ }
  }

  function frame() {
    if (disposed) return;
    stepSeek();
    paint();
    rafId = requestAnimationFrame(frame);
  }

  function setProgress(f: number) {
    if (refs.bootBar.current) refs.bootBar.current.style.transform = `scaleX(${f})`;
    if (refs.bootPct.current) refs.bootPct.current.textContent = `LOADING ${Math.round(f * 100)}%`;
  }

  function start() {
    if (started) return;
    started = true;
    ready = !failed;
    readScroll();
    seekAt = seekTo;
    onStatus(failed ? "static" : "ready");
  }

  function attach(src: string) {
    if (attached) return;
    attached = true;
    // Bind listeners before setting src.
    clip.addEventListener("loadedmetadata", () => {
      duration = clip.duration || 0;
      clip.pause();
      readScroll();
      seekAt = seekTo;
      try { clip.currentTime = seekAt; } catch { /* not seekable yet */ }
    });
    clip.addEventListener("loadeddata", start);
    clip.addEventListener("canplaythrough", start);
    clip.addEventListener("error", () => { failed = true; start(); });
    clip.src = src;
    clip.load();
    // A stalled decode never strands the hero behind the preloader.
    setTimeout(start, ATTACH_TIMEOUT_MS);
  }

  // Fetch the mp4 as a fully buffered blob first: seeking inside a buffered blob
  // is near instant, while range requests over the network are a slideshow.
  function preload() {
    const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
    const bail = setTimeout(() => {
      if (attached) return;
      controller?.abort();
      setProgress(1);
      attach(HERO_VIDEO_URL);
    }, PRELOAD_BAIL_MS);

    fetch(HERO_VIDEO_URL, controller ? { signal: controller.signal } : undefined)
      .then(readAsBlob)
      .then((blob) => { clearTimeout(bail); setProgress(1); attach(URL.createObjectURL(blob)); })
      .catch(() => { clearTimeout(bail); setProgress(1); attach(HERO_VIDEO_URL); }); // CORS failure, abort, offline
  }

  async function readAsBlob(res: Response) {
    if (!res.ok || !res.body) throw new Error("bad response");
    const total = Number(res.headers.get("content-length") || 0) || 0;
    const reader = res.body.getReader();
    const chunks: BlobPart[] = [];
    let got = 0;
    for (;;) {
      const r = await reader.read();
      if (r.done) return new Blob(chunks, { type: "video/mp4" });
      chunks.push(r.value);
      got += r.value.length;
      setProgress(total ? got / total : Math.min(got / HERO_VIDEO_BYTES, 0.95));
    }
  }

  // iOS will not paint a frame from a video that has never been played, so nudge
  // it once on the first interaction and pause immediately.
  function unlock() {
    const p = clip.play();
    if (p && typeof p.then === "function") p.then(() => clip.pause()).catch(() => undefined);
    else clip.pause();
  }
  const UNLOCK_EVENTS = ["touchstart", "pointerdown", "wheel", "keydown"] as const;
  UNLOCK_EVENTS.forEach((ev) => window.addEventListener(ev, unlock, { once: true, passive: true }));

  window.addEventListener("scroll", readScroll, { passive: true });
  window.addEventListener("resize", readScroll);

  readScroll();
  paint();
  if (reducedMotion) {
    // Poster frame and the first panel, static; no fetch, no rAF loop.
    failed = true;
    setTimeout(start, 0);
  } else {
    preload();
    rafId = requestAnimationFrame(frame);
  }

  return {
    dispose() {
      disposed = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", readScroll);
      window.removeEventListener("resize", readScroll);
      UNLOCK_EVENTS.forEach((ev) => window.removeEventListener(ev, unlock));
    },
  };
}
