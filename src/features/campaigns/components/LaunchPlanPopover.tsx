import { Check, X } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import type { LaunchPlanDto } from "../schemas";

type Props = { plan: LaunchPlanDto; onClose?: () => void };

const STEPS = [
  {
    key: "explored",
    title: "Discover the Marketplace",
    body: "Compare your matched creators by sector, reach, performance and price.",
    cta: "Explore",
    href: "/brand/creators",
  },
  {
    key: "briefed",
    title: "Create your first brief",
    body: "Open the guided editor and turn your campaign goal into creator-ready instructions.",
    cta: "Create your first brief",
    href: "/brand/campaigns/new",
  },
  {
    key: "invited",
    title: "Book or negotiate with a creator",
    body: "Choose an offer, negotiate if needed, and send your first funded invitation.",
    cta: "Choose creator",
    href: "/brand/creators",
  },
] as const;

// The GET STARTED checklist content (inventory, "Brand — top bar"). The shell
// mounts it in a popover; the campaigns list shows it as a card.
export function LaunchPlanPopover({ plan, onClose }: Props) {
  const total = STEPS.length;
  const done = total - plan.stepsLeft;
  return (
    <section aria-labelledby="launch-plan-title" className="w-full max-w-md text-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your launch plan</p>
          <h2 id="launch-plan-title" className="mt-1 text-lg font-semibold leading-tight">
            Launch your first creator collaboration
          </h2>
          <p className="mt-1 text-muted-foreground">Three guided actions take you from discovery to your first creator invitation.</p>
        </div>
        {onClose ? (
          <button type="button" onClick={onClose} aria-label="Close checklist" className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground">
            <X className="size-4" aria-hidden="true" />
          </button>
        ) : null}
      </div>
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {done}/{total} complete
          </span>
          <span>{plan.stepsLeft === 0 ? "All done" : `${plan.stepsLeft} ${plan.stepsLeft === 1 ? "step" : "steps"} left`}</span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={done} aria-label="Activation progress">
          <div className="h-full rounded-full bg-brand" style={{ width: `${(done / total) * 100}%` }} />
        </div>
      </div>
      <ol className="mt-4 divide-y">
        {STEPS.map((step, i) => {
          const isDone = plan[step.key];
          return (
            <li key={step.key} className="flex gap-3 py-3">
              <span
                className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${isDone ? "bg-brand text-brand-foreground" : "bg-muted text-muted-foreground"}`}
                aria-hidden="true"
              >
                {isDone ? <Check className="size-3.5" /> : i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{step.title}</p>
                <p className="text-muted-foreground">{step.body}</p>
                <Link href={step.href} className={buttonVariants({ variant: isDone ? "outline" : "default", size: "sm", className: "mt-2" })}>
                  {isDone ? "Done" : step.cta} →
                </Link>
              </div>
            </li>
          );
        })}
      </ol>
      <p className="mt-2 text-xs text-muted-foreground">You can close this checklist and resume it at any time.</p>
    </section>
  );
}
