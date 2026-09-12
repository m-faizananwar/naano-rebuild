import { Check } from "lucide-react";
import Link from "next/link";
import { LAUNCH_STEPS, type LaunchStepKey } from "../../constants";

type Props = { campaignId: string; active: LaunchStepKey };

export function StepNav({ campaignId, active }: Props) {
  const activeIndex = LAUNCH_STEPS.findIndex((s) => s.key === active);
  return (
    <ol className="flex flex-wrap gap-2" aria-label="Launch steps">
      {LAUNCH_STEPS.map((step, i) => {
        const done = i < activeIndex;
        const current = i === activeIndex;
        const inner = (
          <>
            <span
              className={`flex size-5 items-center justify-center rounded-full text-[11px] font-semibold ${done || current ? "bg-brand text-brand-foreground" : "bg-muted text-muted-foreground"}`}
              aria-hidden="true"
            >
              {done ? <Check className="size-3" /> : i + 1}
            </span>
            <span className={current ? "font-semibold" : "text-muted-foreground"}>{step.label}</span>
          </>
        );
        return (
          <li key={step.key} className="flex items-center gap-2 text-sm" aria-current={current ? "step" : undefined}>
            {done ? (
              <Link href={`/brand/campaigns/${campaignId}/launch?step=${step.key}`} className="flex items-center gap-2 hover:underline">
                {inner}
              </Link>
            ) : (
              <span className="flex items-center gap-2">{inner}</span>
            )}
            {i < LAUNCH_STEPS.length - 1 ? <span className="mx-1 h-px w-6 bg-border" aria-hidden="true" /> : null}
          </li>
        );
      })}
    </ol>
  );
}
