import { CheckCircle2, ChevronRight } from "lucide-react";
import Link from "next/link";

// "Your launch guide — 1 of 1 steps complete" from the reference overview.
export function LaunchGuide({ ready }: { ready: boolean }) {
  return (
    <section className="rounded-2xl border bg-background p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold">Your launch guide</h2>
          <p className="text-sm text-muted-foreground">{ready ? "1 of 1 steps complete" : "0 of 1 steps complete"}</p>
        </div>
        <Link href="/creator/card" className="text-sm font-medium text-brand hover:underline">Open card</Link>
      </div>
      <Link href={ready ? "/creator/card" : "/onboarding/creator"} className="mt-5 flex items-center gap-3 rounded-xl px-1 py-2 hover:bg-muted">
        <span className={ready ? "flex size-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700" : "flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground"}>
          <CheckCircle2 className="size-4" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-medium">Card and price ready</span>
          <span className="block text-xs text-muted-foreground">Your positioning and offer are ready to review.</span>
        </span>
        <span className={ready ? "rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700" : "rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground"}>
          {ready ? "Complete" : "To do"}
        </span>
        <span className="flex size-8 items-center justify-center rounded-lg border text-muted-foreground" aria-hidden="true">
          <ChevronRight className="size-4" />
        </span>
      </Link>
    </section>
  );
}
