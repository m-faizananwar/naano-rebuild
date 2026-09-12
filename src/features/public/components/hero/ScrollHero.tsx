"use client";

import { Inter_Tight } from "next/font/google";
import Link from "next/link";
import { useRef } from "react";
import { cn } from "cn";
import { HERO_POSTER, PANELS } from "./hero-config";
import styles from "./ScrollHero.module.css";
import { useScrollScrub } from "./useScrollScrub";

// Inter Tight for the hero's display type only; the rest of the page keeps Inter.
const interTight = Inter_Tight({ subsets: ["latin"], weight: ["400", "500"], display: "swap" });

// The scroll-scrubbed video hero, ported from public/hero/index.html: a 560vh
// track with a sticky one-viewport stage; scrolling the track scrubs the video
// and cross-fades three panels. Preload starts after hydration and the boot
// overlay covers only the hero, so the ~11MB clip never blocks first paint.
export function ScrollHero() {
  const wrapper = useRef<HTMLElement>(null);
  const clip = useRef<HTMLVideoElement>(null);
  const meter = useRef<HTMLElement>(null);
  const bootBar = useRef<HTMLElement>(null);
  const bootPct = useRef<HTMLParagraphElement>(null);
  const panels = useRef<Array<HTMLElement | null>>([]);
  const status = useScrollScrub({ wrapper, clip, meter, bootBar, bootPct, panels });

  return (
    <section ref={wrapper} className={cn(styles.hero, interTight.className, status === "static" && styles.static)} aria-label="Introduction">
      <div className={styles.stage}>
        <video ref={clip} muted playsInline preload="none" disablePictureInPicture poster={HERO_POSTER} aria-hidden="true" />
        <div className={styles.veil} />
        <div className={styles.grain} />
        <i ref={meter} className={styles.meter} aria-hidden="true" />

        <div className={styles.panels}>
          {PANELS.map((panel, i) => (
            <section key={panel.h1} ref={(el) => { panels.current[i] = el; }} className={styles.panel} data-panel>
              <p className={styles.eyebrow}>{panel.eyebrow}</p>
              <h1 className={styles.h1}>{panel.h1}</h1>
              <p className={styles.sub}>{panel.sub}</p>
              <div className={styles.cta}>
                <Link href={panel.cta.href} className={styles.pill}>{panel.cta.label}</Link>
              </div>
            </section>
          ))}
        </div>

        <div className={cn(styles.boot, status !== "loading" && styles.bootDone)} aria-hidden={status !== "loading"}>
          <div className={styles.bar}><i ref={bootBar} /></div>
          <p ref={bootPct}>LOADING 0%</p>
        </div>
      </div>
    </section>
  );
}
