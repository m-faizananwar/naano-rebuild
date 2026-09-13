"use client";

import { type RefObject, useEffect, useState } from "react";
import { markHeroReady, reportHeroProgress } from "../splash/splash-events";
import {
  ATTACH_TIMEOUT_MS, CUES, DRIFT, HERO_LOCAL_URL, SEEK_EASE, SEEK_RELEASE_MS, SEEK_SNAP_S,
} from "./hero-config";

type Refs = {
  wrapper: RefObject<HTMLElement | null>;
  clip: RefObject<HTMLVideoElement | null>;
  meter: RefObject<HTMLElement | null>;
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
  // rVFC pacing: the next currentTime is issued only after the previous frame painted
  let seekInFlight = false;
  let rafId = 0;
  const hasRvfc = "requestVideoFrameCallback" in clip;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Progress = scroll within the wrapper: 0 when its top hits the viewport top,
  // 1 when its bottom meets the viewport bottom (the sticky stage's last frame).
  let lastScrollAt = 0;
  function readScroll() {
    lastScrollAt = performance.now();
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
    if (gap === 0) return;
    // ease toward the target; snap once the remainder is under a few ms of video
    seekAt = Math.abs(gap) < SEEK_SNAP_S ? seekTo : seekAt + gap * SEEK_EASE;
    if (clip.readyState < 2 || clip.seeking || seekInFlight) return;
    try {
      clip.currentTime = seekAt;
      if (hasRvfc) {
        // fast wheels never queue seeks: wait for this frame to paint first.
        // `seeked` and a short timeout also release it — a seek that lands on
        // the frame already shown never presents a new one.
        seekInFlight = true;
        const release = () => { seekInFlight = false; };
        clip.requestVideoFrameCallback(release);
        clip.addEventListener("seeked", release, { once: true });
        setTimeout(release, SEEK_RELEASE_MS);
      }
    } catch { /* not seekable yet */ }
  }

  function frame() {
    if (disposed) return;
    stepSeek();
    paint();
    rafId = requestAnimationFrame(frame);
  }

  // The spec's boot bar is gone (the landing splash shows the number instead);
  // progress goes to the splash bus so its counter is real.
  function setProgress(f: number) {
    reportHeroProgress(f);
  }

  function start() {
    if (started) return;
    started = true;
    ready = !failed;
    readScroll();
    seekAt = seekTo;
    onStatus(failed ? "static" : "ready");
    markHeroReady();
  }

  // The one source: the small all-intra clip in public/media, attached at
  // mount so seeking works from the first scroll (Vercel's CDN caches it).
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
    // the splash counter follows the clip's buffer
    const onProgress = () => {
      if (!clip.duration) return;
      const end = clip.buffered.length ? clip.buffered.end(clip.buffered.length - 1) : 0;
      setProgress(end / clip.duration);
    };
    clip.addEventListener("progress", onProgress);
    clip.addEventListener("canplaythrough", onProgress, { once: true });
    clip.src = src;
    clip.load();
    // A stalled decode never strands the hero.
    setTimeout(start, ATTACH_TIMEOUT_MS);
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
    attach(HERO_LOCAL_URL);
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
