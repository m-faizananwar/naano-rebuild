"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { cn } from "cn";
import { BrandLockup } from "@/components/brand/BrandLockup";
import { BRAND } from "@/config/brand";
import { GLASS_NAV_CELLS } from "../../constants";
import styles from "./glass-nav.module.css";
import { MobilePublicNav } from "./MobilePublicNav";
import { useGlassNav } from "./useGlassNav";

// The landing nav as the spec's five-cell glass controller: lockup (cell 0,
// home link, the capsule's rest position), four links; capsule slides to the
// hovered/focused cell; a click plays the forward choreography, then
// navigates (or scrolls, then reverses). ≤700 the same glass track is the
// trigger row for the slide-in menu.
export function GlassNav() {
  const controller = useRef<HTMLDivElement>(null);
  const capsule = useRef<HTMLDivElement>(null);
  const nav = useGlassNav({
    controller, capsule, cellCount: GLASS_NAV_CELLS.length + 1,
    classes: { collapsed: styles.collapsed, trackFaded: styles.trackFaded, chosen: styles.chosen, faded: styles.faded },
  });
  const busy = nav.phase !== "idle";

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div
          ref={controller}
          role="navigation"
          aria-label="Main"
          className={cn(styles.controller, nav.phase === "collapsing" && cn(styles.collapsed, styles.trackFaded), nav.phase === "expanding" && styles.expanding)}
          onPointerMove={nav.onPointerMove}
          onPointerLeave={nav.leave}
        >
          <div className={cn(styles.glass, styles.track)} aria-hidden="true" />
          <div ref={capsule} className={cn(styles.glass, styles.capsule)} aria-hidden="true" />
          <div className={styles.cells}>
            <Link href="/" data-index={0} aria-label={`${BRAND.name} home`} className={cn(styles.cell, styles.lockup, nav.phase === "collapsing" && styles.faded, nav.phase === "expanding" && styles.restoring)} onPointerEnter={() => nav.hover(0)}>
              <BrandLockup size="sm" />
            </Link>
            {GLASS_NAV_CELLS.map((cell, i) => {
              const index = i + 1;
              const chosen = nav.chosen === index;
              return (
                <a
                  key={cell.label}
                  href={cell.href}
                  data-index={index}
                  className={cn(styles.cell, nav.phase === "collapsing" && !chosen && styles.faded, chosen && styles.chosen, nav.phase === "expanding" && styles.restoring)}
                  aria-hidden={busy && !chosen ? true : undefined}
                  tabIndex={busy && !chosen ? -1 : undefined}
                  onPointerEnter={() => nav.hover(index)}
                  onFocus={() => nav.focus(index)}
                  onBlur={() => nav.blur(index)}
                  onClick={(e) => { e.preventDefault(); nav.navigate(index, cell.href); }}
                >
                  {cell.label}
                </a>
              );
            })}
          </div>
        </div>
        <div className={styles.actions}>
          <Link href="/login" className={styles.signin}>Sign in</Link>
          <Link href="/register" className={styles.pill}>Sign up</Link>
        </div>
        <div className={styles.mobileRow}>
          <div className={cn(styles.glass, styles.track)} aria-hidden="true" />
          <Link href="/" className={cn(styles.mobileCell, styles.lockup)} aria-label={`${BRAND.name} home`}><BrandLockup size="sm" /></Link>
          <MobilePublicNav trigger={{ className: styles.mobileCell, children: <><Menu aria-hidden="true" size={18} /> Menu</> }} />
        </div>
      </div>
    </header>
  );
}
