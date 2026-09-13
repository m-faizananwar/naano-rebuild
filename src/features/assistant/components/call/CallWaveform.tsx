"use client";

import { useEffect, useRef } from "react";
import { MetalFx } from "metal-fx";

const BARS = 28;
const FFT = 64;

// A metal bar reacting to the mic level (AnalyserNode on the mic stream); with
// no mic it moves on the assistant's speech instead.
export function CallWaveform({ listening, speaking }: { listening: boolean; speaking: boolean }) {
  const bars = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    let analyser: AnalyserNode | null = null;
    let stream: MediaStream | null = null;
    let ctx: AudioContext | null = null;
    const data = new Uint8Array(FFT / 2);
    const paint = () => {
      const el = bars.current;
      if (!el) return;
      analyser?.getByteFrequencyData(data);
      const t = performance.now() / 180;
      for (let i = 0; i < el.children.length; i++) {
        const mic = analyser ? data[Math.floor((i / BARS) * data.length)] / 255 : 0;
        const synth = speaking ? 0.25 + 0.5 * Math.abs(Math.sin(t + i * 0.6)) : 0.08;
        (el.children[i] as HTMLElement).style.transform = `scaleY(${Math.max(0.08, analyser ? mic : synth)})`;
      }
      raf = requestAnimationFrame(paint);
    };
    if (listening && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((s) => {
          stream = s;
          ctx = new AudioContext();
          analyser = ctx.createAnalyser();
          analyser.fftSize = FFT;
          ctx.createMediaStreamSource(s).connect(analyser);
        })
        .catch(() => undefined);
    }
    raf = requestAnimationFrame(paint);
    return () => {
      cancelAnimationFrame(raf);
      stream?.getTracks().forEach((tr) => tr.stop());
      void ctx?.close();
    };
  }, [listening, speaking]);

  return (
    <MetalFx variant="button" preset="silver" theme="dark" strength={listening || speaking ? 0.5 : 0.2}>
      <div ref={bars} className="flex h-12 w-72 items-center justify-center gap-1 rounded-full px-4" aria-hidden="true">
        {Array.from({ length: BARS }, (_, i) => (
          <span key={i} className="block h-8 w-1 origin-center rounded-full bg-white/80 transition-transform duration-75" style={{ transform: "scaleY(0.08)" }} />
        ))}
      </div>
    </MetalFx>
  );
}
