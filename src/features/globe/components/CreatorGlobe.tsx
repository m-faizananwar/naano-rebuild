"use client";

import { useEffect, useRef, useState } from "react";
import { countryName } from "@/lib/country-flag";
import { type CountryCount, globeMarkers } from "@/lib/country-coords";
import {
  GLOBE_DARK, GLOBE_DIFFUSE, GLOBE_MAP_BASE_BRIGHTNESS, GLOBE_MAP_BRIGHTNESS, GLOBE_MAP_SAMPLES, GLOBE_PALETTE, GLOBE_PIXEL_RATIO, GLOBE_SPIN_PER_FRAME, GLOBE_THETA,
} from "../constants";
import "./globe.css";

type Props = { size: number; countries: CountryCount[]; className?: string; label?: string };

// A slow-spinning cobe globe with one ink marker per creator country, sized
// by count. cobe is loaded on demand (never in the first paint), and the
// marker hit targets ride cobe's CSS anchors (--cobe-<id>) so the tooltip
// "France · 41 creators" follows the marker round the globe. Reduced motion:
// static, no spin.
export function CreatorGlobe({ size, countries, className, label = "Creators by country" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const markers = globeMarkers(countries);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let phi = 0;
    let destroy = () => undefined as void;
    let cancelled = false;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    void import("cobe").then(({ default: createGlobe }) => {
      if (cancelled) return;
      const globe = createGlobe(canvas, {
        devicePixelRatio: GLOBE_PIXEL_RATIO,
        width: size * GLOBE_PIXEL_RATIO,
        height: size * GLOBE_PIXEL_RATIO,
        phi: 0,
        theta: GLOBE_THETA,
        dark: GLOBE_DARK,
        diffuse: GLOBE_DIFFUSE,
        mapSamples: GLOBE_MAP_SAMPLES,
        mapBrightness: GLOBE_MAP_BRIGHTNESS,
        mapBaseBrightness: GLOBE_MAP_BASE_BRIGHTNESS,
        baseColor: GLOBE_PALETTE.base,
        markerColor: GLOBE_PALETTE.marker,
        glowColor: GLOBE_PALETTE.glow,
        markers: markers.map((m) => ({ location: m.location, size: m.size, id: m.code })),
        // onRender is in cobe's runtime options but missing from its typings.
        ...({ onRender: (state: { phi?: number }) => { if (!reduced) phi += GLOBE_SPIN_PER_FRAME; state.phi = phi; } } as object),
      });
      destroy = () => globe.destroy();
      setReady(true);
    });
    return () => {
      cancelled = true;
      destroy();
    };
    // markers derive from `countries`, stable for the life of the page
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size]);

  return (
    <div className={`creator-globe relative ${className ?? ""}`} style={{ width: size, height: size }} role="img" aria-label={label}>
      <canvas ref={canvasRef} width={size * GLOBE_PIXEL_RATIO} height={size * GLOBE_PIXEL_RATIO} style={{ width: size, height: size, opacity: ready ? 1 : 0 }} className="transition-opacity duration-700" />
      {ready
        ? markers.map((m) => (
            <span key={m.code} className="creator-globe__hit" style={{ "--anchor": `--cobe-${m.code}`, "--visible": `var(--cobe-visible-${m.code}, 0)` } as React.CSSProperties} tabIndex={0}>
              <span className="creator-globe__tip" role="tooltip">{countryName(m.code)} · {m.count} creators</span>
            </span>
          ))
        : null}
    </div>
  );
}
