import { ONBOARDING_STEPS_TOTAL } from "../constants";

type Props = { step: number; title: string; sub: string };

// "Step N of 3" eyebrow + title + one-line explanation, like naano's sign-up.
export function OnboardingStepHeader({ step, title, sub }: Props) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-brand">
        Step {step} of {ONBOARDING_STEPS_TOTAL}
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">{title}</h1>
      <p className="mt-3 text-sm text-muted-foreground">{sub}</p>
    </div>
  );
}
