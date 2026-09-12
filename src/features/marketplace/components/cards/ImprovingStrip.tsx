"use client";

import { Sparkles } from "lucide-react";

import { BRAND } from "@/config/brand";
// naano's "Naano is improving your shortlist" strip: shimmer plus a progress
// bar that runs ~4s after the list mounts, then the strip collapses.
export function ImprovingStrip() {
  return (
    <div className="animate-collapse overflow-hidden" aria-live="polite">
      <div className="animate-shimmer mb-4 flex items-center gap-3 rounded-xl border bg-brand/5 px-4 py-2.5 text-sm">
        <Sparkles className="size-4 text-brand" aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate">
          <span className="font-medium">{BRAND.name} is improving your shortlist</span>
          <span className="text-muted-foreground"> — AI is refining your matches using recent creator performance… Comparing creator evidence with your ICP…</span>
        </span>
        <span className="hidden h-1.5 w-32 overflow-hidden rounded-full bg-muted sm:block" role="progressbar" aria-label="Refining matches">
          <span className="block h-full rounded-full bg-brand [animation:fillBar_4s_linear_both]" style={{ width: "100%" }} />
        </span>
      </div>
    </div>
  );
}
