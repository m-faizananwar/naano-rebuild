"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { ANALYSIS_MIN_MS, ANALYSIS_STAGES, ANALYSIS_TICK_MS } from "../constants";

const HOLD_AT_PERCENT = 95;
const PERCENT = 100;

function stageFor(elapsedMs: number) {
  return [...ANALYSIS_STAGES].reverse().find((stage) => elapsedMs >= stage.atMs) ?? ANALYSIS_STAGES[0];
}

// Mounted while the server reads the site: staged messages and a bar that
// fills over ANALYSIS_MIN_MS, then holds until the server answers.
export function AnalysisProgress({ url }: { url: string }) {
  const [elapsedMs, setElapsedMs] = useState(0);
  useEffect(() => {
    const startedAt = Date.now();
    const timer = window.setInterval(() => setElapsedMs(Date.now() - startedAt), ANALYSIS_TICK_MS);
    return () => window.clearInterval(timer);
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
        <div className="h-full rounded-full bg-brand transition-[width] duration-300 ease-linear" style={{ width: `${percent}%` }} />
      </div>
      <ol className="mt-4 grid gap-1.5 text-xs text-muted-foreground">
        {ANALYSIS_STAGES.map((item) => {
          const done = elapsedMs >= item.atMs;
          return (
            <li key={item.label} className={done ? "text-foreground" : undefined}>
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
