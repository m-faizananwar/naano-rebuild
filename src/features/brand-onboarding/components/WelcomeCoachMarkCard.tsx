"use client";

import { Sparkles, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { COPY, WELCOME_PARAMS } from "../constants";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Step 3 of onboarding: the coach mark over AI Matching. Rendered only while
// ?welcomeCampaign=<uuid>&welcomeStep=creators is in the URL; "Got it"
// strips the two params and keeps everything else.
export function WelcomeCoachMarkCard() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const campaignId = params.get(WELCOME_PARAMS.campaign) ?? "";
  const step = params.get(WELCOME_PARAMS.step);
  if (!UUID.test(campaignId) || step !== WELCOME_PARAMS.stepValue) return null;

  function dismiss() {
    const next = new URLSearchParams(params.toString());
    next.delete(WELCOME_PARAMS.campaign);
    next.delete(WELCOME_PARAMS.step);
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  return (
    <aside
      role="dialog"
      aria-labelledby="welcome-coach-title"
      aria-describedby="welcome-coach-body"
      className="fixed inset-x-4 bottom-4 z-50 rounded-2xl border border-brand/40 bg-background p-4 shadow-xl sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-96"
    >
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand" aria-hidden="true">
          <Sparkles className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand">Step 3 of 3</p>
          <h2 id="welcome-coach-title" className="mt-1 text-base font-semibold">
            {COPY.coachMark.title}
          </h2>
          <p id="welcome-coach-body" className="mt-1 text-sm text-muted-foreground">
            {COPY.coachMark.body}
          </p>
        </div>
        <Button type="button" variant="ghost" size="icon-sm" aria-label="Dismiss" onClick={dismiss}>
          <X className="size-4" aria-hidden="true" />
        </Button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="button" onClick={dismiss} className="bg-brand text-brand-foreground hover:bg-brand/90">
          {COPY.coachMark.gotIt}
        </Button>
        <Link href={`/brand/campaigns/${campaignId}`} className={buttonVariants({ variant: "outline" })}>
          {COPY.coachMark.backToCampaign}
        </Link>
      </div>
    </aside>
  );
}
