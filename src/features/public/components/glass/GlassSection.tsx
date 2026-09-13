"use client";

import { createContext, type ReactNode, type RefObject, useContext, useRef } from "react";
import { cn } from "cn";
import styles from "./glass.module.css";

export const HERO_STILL = "/backdrops/hero-still.jpg";

// The soft static backdrop that card sections give their glass cards to bend:
// the hero still, blurred 18px under a low-opacity paper wash (glass.module.css).
export const GlassBackdropContext = createContext<{ section: RefObject<HTMLElement | null>; src: string } | null>(null);

// A landing section with the backdrop. Cards inside draw it into their
// duplicate canvas once (GlassCard + useStaticGlass); the section itself
// paints the same image behind them.
export function GlassSection({ id, className, children }: { id?: string; className?: string; children: ReactNode }) {
  const section = useRef<HTMLElement>(null);
  return (
    <GlassBackdropContext.Provider value={{ section, src: HERO_STILL }}>
      <section id={id} ref={section} className={cn(styles.backdropSection, className)}>
        <div className={styles.backdropImage} aria-hidden="true" />
        <div className={styles.backdropContent}>{children}</div>
      </section>
    </GlassBackdropContext.Provider>
  );
}

export const useGlassBackdrop = () => useContext(GlassBackdropContext);
