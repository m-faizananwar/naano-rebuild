"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { CREATOR_TOUR } from "@/features/workspace/constants";

const WORKSPACE = "/creator";

// First-run tour on /creator?tour=1: naano's 5-step popover, bottom-right.
// Skip / Done drop the query so a refresh does not restart it.
export function TourOverlay() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(true);
  if (!open) return null;
  const step = CREATOR_TOUR[index] ?? CREATOR_TOUR[0];
  const last = index === CREATOR_TOUR.length - 1;

  function close() {
    setOpen(false);
    router.replace(WORKSPACE);
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-40 flex items-end justify-center p-4 sm:justify-end sm:p-6">
      <section
        role="dialog"
        aria-modal="false"
        aria-labelledby="tour-title"
        className="pointer-events-auto w-full max-w-sm rounded-2xl border bg-card p-5 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Step {step.step} of {CREATOR_TOUR.length}
          </p>
          <button type="button" onClick={close} className="rounded-md text-xs font-medium text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50">
            Skip
          </button>
        </div>
        <h2 id="tour-title" className="mt-3 text-lg font-bold tracking-tight">{step.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
        {index > 0 ? <p className="mt-2 text-xs text-muted-foreground">Find it in the sidebar: <span className="font-semibold text-foreground">{step.title}</span>.</p> : null}
        <div className="mt-4 flex items-center justify-between gap-3">
          <ol className="flex gap-1.5" aria-label="Tour progress">
            {CREATOR_TOUR.map((s, i) => (
              <li key={s.step} className={i === index ? "h-1.5 w-5 rounded-full bg-brand" : "size-1.5 rounded-full bg-muted-foreground/30"} aria-current={i === index ? "step" : undefined} />
            ))}
          </ol>
          <div className="flex items-center gap-2">
            {index > 0 ? (
              <Link href={step.href} className={buttonVariants({ variant: "outline", size: "sm" })}>
                {step.cta}
              </Link>
            ) : null}
            {last ? (
              <Button size="sm" onClick={close} className="bg-brand text-brand-foreground hover:bg-brand/90">Done</Button>
            ) : (
              <Button size="sm" onClick={() => setIndex(index + 1)} className="bg-brand text-brand-foreground hover:bg-brand/90">Next</Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
