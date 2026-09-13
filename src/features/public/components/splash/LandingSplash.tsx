"use client";

import { useEffect, useRef, useState } from "react";
import { BrandMark } from "@/components/brand/BrandMark";
import styles from "./splash.module.css";
import { markSplashDone, onHeroProgress } from "./splash-events";

const R = 150;
const CIRC = 2 * Math.PI * R;
const FIRST_TARGET = 85;
const FIRST_MS = 260;
const SETTLE_MS = 120;
// The whole splash, exit included, is gone within 2500ms of first paint:
// 100 is forced at ~1.7s at the latest, then out (450) + fade (200).
const BUDGET_MS = 2500;
const HOLD_MS = 80;
const OUT_MS = 450;
const FADE_MS = 200;
// timer + animation-finish overhead measured at ~50–100ms, hence the margin
const EXIT_MARGIN_MS = 120;
const FORCE_AT_MS = BUDGET_MS - OUT_MS - FADE_MS - EXIT_MARGIN_MS; // 1730
const OUT_EASE = "cubic-bezier(.55,.085,.68,.53)";
const STORAGE_KEY = "amplio:splash";
const MARK_SIZE = 120;

const power2Out = (t: number) => 1 - Math.pow(1 - t, 2);
const power2InOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

// Inline, before hydration: a tab that has seen the splash never paints it.
const SEEN_SCRIPT = `try{if(sessionStorage.getItem(${JSON.stringify(STORAGE_KEY)}))document.documentElement.dataset.splash="seen"}catch(e){}`;

// First visit per tab on the landing: a full-screen splash while the hero
// preloads behind it. The counter runs 0→85 over 260ms (power2.out), holds on
// the real preload progress (read for the number only — nothing waits on the
// blob's attach), then 85→100 over 120ms once fonts are ready and the preload
// is complete, or cuts straight to 100 when the budget fires. 80ms after 100
// the ring and number scale out (450ms) and the overlay fades (200ms); the
// forced path skips the hold so everything is gone by 2500ms from first
// paint. No click gate. Scroll is locked underneath with the scrollbar gap
// compensated.
export function LandingSplash() {
  const root = useRef<HTMLDivElement>(null);
  const ring = useRef<SVGCircleElement>(null);
  const ringSvg = useRef<SVGSVGElement>(null);
  const pct = useRef<HTMLSpanElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (document.documentElement.dataset.splash === "seen") { markSplashDone(); const raf = requestAnimationFrame(() => setGone(true)); return () => cancelAnimationFrame(raf); }
    try { sessionStorage.setItem(STORAGE_KEY, "1"); } catch { /* storage may be blocked */ }
    // budget counted from first paint, not from hydration
    const paintAt = performance.getEntriesByType("paint").find((e) => e.name === "first-contentful-paint")?.startTime ?? performance.now();
    const sincePaint = performance.now() - paintAt;
    if (sincePaint >= FORCE_AT_MS) {
      // Hydration arrived late: the CSS budget guard has taken (or is taking) the
      // overlay out already — just clear it, no lock, no scripted exit.
      markSplashDone();
      const raf = requestAnimationFrame(() => setGone(true));
      return () => cancelAnimationFrame(raf);
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${gap}px`;
    const unlock = () => { document.body.style.overflow = ""; document.body.style.paddingRight = ""; };

    let killed = false, raf = 0, shown = 0, heroFraction = 0, settling = false, forced = false;
    const forceIn = Math.max(0, FORCE_AT_MS - sincePaint);
    const paint = (value: number) => {
      shown = Math.max(shown, Math.round(value));
      if (ring.current) ring.current.style.strokeDashoffset = String(CIRC * (1 - shown / 100));
      if (pct.current) pct.current.textContent = `${shown}%`;
    };
    let from = 0, start = performance.now(), dur = FIRST_MS, target = FIRST_TARGET, ease = power2Out;
    const finish = () => {
      if (killed) return;
      unlock();
      const out = [ringSvg.current, pct.current].filter(Boolean) as Element[];
      const fade = () => {
        const a = root.current?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: reduced ? 1 : FADE_MS, easing: OUT_EASE, fill: "both" });
        const end = () => { markSplashDone(); setGone(true); };
        if (a) a.onfinish = end; else end();
      };
      if (reduced) { fade(); return; }
      window.setTimeout(() => {
        out.forEach((el) => el.animate([{ opacity: 1, transform: "scale(1)" }, { opacity: 0, transform: "scale(0.85)" }], { duration: OUT_MS, easing: OUT_EASE, fill: "both" }));
        window.setTimeout(fade, OUT_MS);
      }, forced ? 0 : HOLD_MS);
    };
    const tick = (now: number) => {
      if (killed) return;
      const t = Math.min(1, (now - start) / dur);
      // between the tweens the number follows the real preload (never above 99 before settle)
      const real = settling ? 0 : Math.min(99, heroFraction * 99);
      paint(Math.max(from + (target - from) * ease(t), real));
      if (t < 1 || !settling) raf = requestAnimationFrame(tick);
      else finish();
    };
    raf = requestAnimationFrame(tick);
    const settle = () => {
      if (killed || settling) return;
      settling = true;
      from = shown; start = performance.now(); dur = SETTLE_MS; target = 100; ease = power2InOut;
    };
    // The budget: cut straight to 100 and exit, whatever the preload is doing.
    const force = () => {
      if (killed || forced) return;
      forced = true;
      settling = true;
      cancelAnimationFrame(raf);
      paint(100);
      finish();
    };
    const cap = window.setTimeout(force, forceIn);
    // Unconditional: 2.5s after first paint the overlay is gone, whatever fonts,
    // the clip or the exit animations are doing (the nav's fade keys off markSplashDone).
    const hardExit = window.setTimeout(() => { if (killed) return; killed = true; cancelAnimationFrame(raf); unlock(); markSplashDone(); setGone(true); }, Math.max(0, BUDGET_MS - sincePaint));
    let fontsReady = false;
    const maybeSettle = () => { if (fontsReady && heroFraction >= 1) settle(); };
    document.fonts.ready.then(() => { fontsReady = true; maybeSettle(); });
    const offProgress = onHeroProgress((f) => { heroFraction = f; maybeSettle(); });
    return () => { killed = true; window.clearTimeout(cap); window.clearTimeout(hardExit); cancelAnimationFrame(raf); offProgress(); unlock(); };
  }, []);

  if (gone) return null;
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: SEEN_SCRIPT }} />
      <div ref={root} data-splash="" className={styles.root} role="status" aria-label="Loading">
        <div className={styles.stage}>
          <svg ref={ringSvg} className={styles.ring} viewBox="0 0 420 420" aria-hidden="true">
            <circle className={styles.trackCircle} cx="210" cy="210" r={R} fill="none" strokeWidth="2.5" />
            <circle ref={ring} className={styles.fillCircle} cx="210" cy="210" r={R} fill="none" strokeWidth="2.5" strokeDasharray={CIRC} strokeDashoffset={CIRC} />
          </svg>
          <div className={styles.centre}>
            <div className={styles.mark}><BrandMark size={MARK_SIZE} /></div>
            <span ref={pct} className={styles.pct}>0%</span>
          </div>
        </div>
      </div>
    </>
  );
}
