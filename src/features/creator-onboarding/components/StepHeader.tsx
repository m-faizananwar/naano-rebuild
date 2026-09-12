import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { STEP_COUNT } from "../constants";

const BACK = "inline-flex items-center gap-2 text-sm text-foreground/80 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 rounded-md";

type Props = { step: number; title: string; intro?: string; back?: { href: string; label: string } };

export function StepHeader({ step, title, intro, back }: Props) {
  return (
    <div>
      {back ? (
        <Link href={back.href} className={BACK}>
          <ArrowLeft className="size-4" aria-hidden="true" />
          {back.label}
        </Link>
      ) : null}
      <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-brand">Step {step} of {STEP_COUNT}</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">{title}</h1>
      {intro ? <p className="mt-3 text-muted-foreground">{intro}</p> : null}
    </div>
  );
}
