"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { countryName } from "@/lib/country-flag";
import { type CountryCount, globeMarkers } from "@/lib/country-coords";
import { DRAG_RADIANS_PER_PX, GLOBE, GLOBE_SPIN_PER_FRAME, INERTIA_DECAY, INERTIA_STOP } from "../constants";
import "./globe.css";

type Props = { size: number; countries: CountryCount[]; className?: string; label?: string };
const SCALE_IN = { type: "spring", stiffness: 260, damping: 24 } as const;

// A cobe globe that behaves like a product: slow auto-rotation that pauses
// on hover, drag to rotate with a flick that decays over about a second, a
// spring scale-in when it scrolls into view, a soft shadow under it, and
// glass tooltips ("France · 84 creators") riding cobe's CSS anchors. cobe is
// imported on demand so it never touches the first paint. Reduced motion:
// static, no spin, no scale-in.
export function CreatorGlobe({ size, countries, className, label = "Creators by country" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const reduced = useReducedMotion();
  const markers = globeMarkers(countries);
  // Rotation state lives in refs: the render loop reads it every frame.
  const rot = useRef({ phi: 0, velocity: 0, hover: false, dragging: false, lastX: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let destroy = () => undefined as void;
    let cancelled = false;
    const r = rot.current;
    void import("cobe").then(({ default: createGlobe }) => {
      if (cancelled) return;
      const globe = createGlobe(canvas, {
        devicePixelRatio: GLOBE.pixelRatio,
        width: size * GLOBE.pixelRatio,
        height: size * GLOBE.pixelRatio,
        phi: 0,
        theta: GLOBE.theta,
        dark: GLOBE.dark,
        diffuse: GLOBE.diffuse,
        mapSamples: GLOBE.mapSamples,
        mapBrightness: GLOBE.mapBrightness,
        baseColor: GLOBE.baseColor,
        markerColor: GLOBE.markerColor,
        glowColor: GLOBE.glowColor,
        markers: markers.map((m) => ({ location: m.location, size: m.size, id: m.code })),
      });
      // cobe 2 has no render loop or onRender: it draws on update(). We run
      // the frame loop — auto-rotation, hover pause, drag and its decay.
      let raf = 0;
      const frame = () => {
        if (!r.dragging) {
          if (Math.abs(r.velocity) > INERTIA_STOP) {
            r.phi += r.velocity;
            r.velocity *= INERTIA_DECAY;
          } else if (!r.hover && !reduced) {
            r.phi += GLOBE_SPIN_PER_FRAME;
          }
        }
        globe.update({ phi: r.phi });
        raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
      destroy = () => {
        cancelAnimationFrame(raf);
        globe.destroy();
      };
      setReady(true);
    });
    return () => {
      cancelled = true;
      destroy();
    };
    // markers derive from `countries`, stable for the life of the page
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size, reduced]);

  const r = rot.current;
  const onPointerDown = (e: React.PointerEvent) => {
    r.dragging = true;
    r.velocity = 0;
    r.lastX = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!r.dragging) return;
    const dx = e.clientX - r.lastX;
    r.lastX = e.clientX;
    r.phi += dx * DRAG_RADIANS_PER_PX;
    r.velocity = dx * DRAG_RADIANS_PER_PX;
  };
  const endDrag = () => {
    r.dragging = false;
  };

  return (
    <motion.div
      className={`creator-globe relative select-none ${className ?? ""}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={label}
      initial={reduced ? { opacity: 0 } : { scale: 0.9, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={reduced ? { duration: 0.3 } : SCALE_IN}
      onPointerEnter={() => { r.hover = true; }}
      onPointerLeave={() => { r.hover = false; endDrag(); }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <span className="creator-globe__shadow" aria-hidden="true" />
      <canvas
        ref={canvasRef}
        width={size * GLOBE.pixelRatio}
        height={size * GLOBE.pixelRatio}
        style={{ width: size, height: size, opacity: ready ? 1 : 0 }}
        className="relative cursor-grab transition-opacity duration-700 active:cursor-grabbing"
      />
      {ready
        ? markers.map((m) => (
            <span key={m.code} className="creator-globe__hit" style={{ "--anchor": `--cobe-${m.code}`, "--visible": `var(--cobe-visible-${m.code}, 0)` } as React.CSSProperties} tabIndex={0}>
              <span className="creator-globe__tip" role="tooltip">{countryName(m.code)} · {m.count} creators</span>
            </span>
          ))
        : null}
    </motion.div>
  );
}
