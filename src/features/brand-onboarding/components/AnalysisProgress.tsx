"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { type TimelineStep, timeline } from "@/lib/motion/anime";
import { ANALYSIS_MIN_MS, ANALYSIS_STAGES, ANALYSIS_TICK_MS } from "../constants";

const HOLD_AT_PERCENT = 95;
const PERCENT = 100;
const STEP_MS = 700;

function stageFor(elapsedMs: number) {
  return [...ANALYSIS_STAGES].reverse().find((stage) => elapsedMs >= stage.atMs) ?? ANALYSIS_STAGES[0];
}

// Mounted while the server reads the site: staged messages, a bar and the
// status lines on one anime timeline (each stage a ≤700ms burst at its
// offset; the bar holds at 95% until the server answers).
export function AnalysisProgress({ url }: { url: string }) {
  const [elapsedMs, setElapsedMs] = useState(0);
  const bar = useRef<HTMLDivElement>(null);
  const lines = useRef<HTMLOListElement>(null);
  useEffect(() => {
    const startedAt = Date.now();
    const timer = window.setInterval(() => setElapsedMs(Date.now() - startedAt), ANALYSIS_TICK_MS);
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => {
    const items = Array.from(lines.current?.querySelectorAll<HTMLElement>("[data-stage]") ?? []);
    if (!bar.current || items.length === 0) return;
    const steps: TimelineStep[] = [];
    ANALYSIS_STAGES.forEach((stage, i) => {
      const share = ((i + 1) / ANALYSIS_STAGES.length) * HOLD_AT_PERCENT;
      steps.push({ target: bar.current as HTMLElement, props: { width: `${share}%` }, duration: STEP_MS, at: stage.atMs });
      steps.push({ target: items[i], props: { opacity: [0.45, 1], translateX: [-6, 0] }, duration: STEP_MS, at: stage.atMs });
    });
    const handle = timeline(steps);
    return () => handle.cancel();
  }, []);
  const percent = Math.min(HOLD_AT_PERCENT, Math.round((elapsedMs / ANALYSIS_MIN_MS) * PERCENT));
  const stage = stageFor(elapsedMs);
  return (
    <div className="rounded-2xl border bg-brand-soft/40 p-5" aria-busy="true" aria-live="polite">
      <p className="truncate text-xs font-semibold uppercase tracking-wide text-muted-foreground">{url}</p>
      <div className="mt-3 flex items-center gap-2 overflow-hidden text-sm font-medium">
        <Loader2 className="size-4 animate-spin text-brand" aria-hidden="true" />
        <span key={stage.label} className="animate-locale-in inline-block">
          {stage.label}
        </span>
      </div>
      <div
        role="progressbar"
        aria-label="Analyzing your website"
        aria-valuemin={0}
        aria-valuemax={PERCENT}
        aria-valuenow={percent}
        className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-muted"
      >
        <div ref={bar} className="h-full rounded-full bg-brand" style={{ width: 0 }} />
      </div>
      <ol ref={lines} className="mt-4 grid gap-1.5 text-xs text-muted-foreground">
        {ANALYSIS_STAGES.map((item) => {
          const done = elapsedMs >= item.atMs;
          return (
            <li key={item.label} data-stage className={done ? "text-foreground" : undefined}>
              <span aria-hidden="true" className="mr-2">
                {done ? "●" : "○"}
              </span>
              {item.label}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
