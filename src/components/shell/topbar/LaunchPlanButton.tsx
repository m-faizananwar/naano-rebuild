"use client";

import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { LaunchPlanPopover } from "@/features/campaigns/components/LaunchPlanPopover";

type Plan = { explored: boolean; briefed: boolean; invited: boolean; stepsLeft: number };
const TOTAL_STEPS = 3;
const RING_RADIUS = 8;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

// The "GET STARTED · Discover the Marketplace · N/3" ring from the brand top bar.
export function LaunchPlanButton({ plan }: { plan: Plan }) {
  const [open, setOpen] = useState(false);
  const done = TOTAL_STEPS - plan.stepsLeft;
  const next = !plan.explored ? "Discover the Marketplace" : !plan.briefed ? "Create your first brief" : "Book or negotiate with a creator";
  if (plan.stepsLeft === 0) return null;
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        aria-label={`Activation progress: ${done} of ${TOTAL_STEPS}`}
        className="hidden h-9 items-center gap-2 rounded-lg border px-3 text-xs font-semibold hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 md:inline-flex"
      >
        <span className="relative flex size-5 items-center justify-center">
          {/* The ring animates its stroke to the current step (0.6s). */}
          <svg viewBox="0 0 20 20" className="absolute inset-0 -rotate-90" aria-hidden="true">
            <circle cx="10" cy="10" r={RING_RADIUS} fill="none" strokeWidth="2" className="stroke-brand/25" />
            <circle
              cx="10"
              cy="10"
              r={RING_RADIUS}
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              className="stroke-brand transition-[stroke-dashoffset] duration-600 ease-out motion-reduce:transition-none"
              strokeDasharray={RING_LENGTH}
              strokeDashoffset={RING_LENGTH * (1 - done / TOTAL_STEPS)}
            />
          </svg>
          <span className="text-[9px] text-brand">{done}</span>
        </span>
        <span className="uppercase tracking-wide text-muted-foreground">Get started</span>
        <span className="hidden lg:inline">· {next}</span>
        <span className="text-muted-foreground">{done}/{TOTAL_STEPS}</span>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[26rem] max-w-[calc(100vw-2rem)] p-4">
        <LaunchPlanPopover plan={plan} onClose={() => setOpen(false)} />
      </PopoverContent>
    </Popover>
  );
}
