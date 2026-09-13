"use client";

import { useEffect, useRef, useState } from "react";
import { BrandLockup } from "@/components/brand/BrandLockup";
import { BRAND } from "@/config/brand";
import { LANDING_COPY } from "./footer-copy";
import { GazeFooter } from "./GazeFooter";
import "./say-hey.css";

// The gaze-scrub character as a landing section (docs/reference/gaze-footer-spec.md):
// our copy in the spec's slots, the amplio lockup in the logo slot, the eyes
// following the pointer on desktop, the loop below the copy ≤700px. The spec
// has no entrance, so this adds ours: the copy rises in with the ink footer's
// delays when the section scrolls into view and the video fades in over 1.35s.
export function SayHeySection() {
  const root = useRef<HTMLElement>(null);
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        setEntered(true);
        io.disconnect();
      }
    }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <section ref={root} id="say-hey" className={`gaze say-hey${entered ? " say-hey--in" : ""}`} aria-label="Say hey">
      <GazeFooter copy={LANDING_COPY} logo={<BrandLockup size="lg" />} logoLabel={`${BRAND.name} logo`} lazyMedia />
    </section>
  );
}
