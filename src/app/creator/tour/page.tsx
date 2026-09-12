import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page/PageHeader";
import { buttonVariants } from "@/components/ui/button";
import { CREATOR_TOUR } from "@/features/workspace/constants";

import { BRAND } from "@/config/brand";
export const metadata: Metadata = { title: `Guided tour · ${BRAND.wordmark}` };

export default function CreatorTourPage() {
  return (
    <>
      <PageHeader title="Guided tour" description="Five steps through your creator workspace." />
      <ol className="grid gap-3">
        {CREATOR_TOUR.map((step) => (
          <li key={step.step} className="flex flex-col gap-3 rounded-2xl border bg-background p-5 sm:flex-row sm:items-center">
            <span className="text-xs font-semibold uppercase tracking-wide text-brand">Step {step.step} of {CREATOR_TOUR.length}</span>
            <span className="flex-1">
              <span className="block font-semibold">{step.title}</span>
              <span className="block text-sm text-muted-foreground">{step.body}</span>
            </span>
            <Link href={step.href} className={buttonVariants({ variant: "outline", size: "sm" })}>{step.cta}</Link>
          </li>
        ))}
      </ol>
    </>
  );
}
