"use client";

import { type RefObject, useEffect } from "react";
import { renderDots, renderTicks } from "./led-dots";

const ENTRANCE_FAILSAFE_MS = 3200;
const ENTRANCE_THRESHOLD = 0.2;
const MOBILE_QUERY = "(max-width: 767px)";

// Wires the stage after hydration: LED dots, gauge ticks, and the one-shot
// entrance. In the standalone the entrance runs at page load; inside the
// scrolling landing it starts when the stage first comes into view, then
// the class comes off on the last control's animationend (or the failsafe).
export function usePerformanceStage(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const stage = root.current;
    if (!stage) return;
    stage.querySelectorAll<HTMLElement>("[data-dots]").forEach(renderDots);
    // The stage's clips (~31MB) only start loading once the stage is near the
    // viewport, so they never compete with the hero on a first load.
    const media = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      media.disconnect();
      stage.querySelectorAll<HTMLVideoElement>("video[data-src]").forEach((v) => {
        if (getComputedStyle(v).display === "none") return;
        v.preload = "auto";
        v.src = v.dataset.src ?? "";
        v.play().catch(() => undefined);
      });
    }, { rootMargin: "100% 0px" });
    media.observe(stage);
    const ticks = stage.querySelector<SVGGElement>(".gauge-ticks");
    if (ticks && ticks.childElementCount === 0) renderTicks(ticks);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let failsafe = 0;
    const finish = () => { clearTimeout(failsafe); stage.classList.remove("entrance-active"); };
    const start = () => {
      stage.classList.add("entrance-active");
      failsafe = window.setTimeout(finish, ENTRANCE_FAILSAFE_MS);
      const mobile = window.matchMedia(MOBILE_QUERY).matches;
      const last = stage.querySelector(mobile ? ".card--speed .learn-more" : ".card--connections .learn-more");
      last?.addEventListener("animationend", finish, { once: true });
    };
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      start();
    }, { threshold: ENTRANCE_THRESHOLD });
    io.observe(stage);
    return () => { io.disconnect(); media.disconnect(); clearTimeout(failsafe); };
    // refs are stable; run once after hydration
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
