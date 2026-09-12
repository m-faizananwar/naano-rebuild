"use client";

import { Cloud } from "lucide-react";
import { useState } from "react";
import { EmptyState } from "@/components/page/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import type { MarketplaceContextDto, MatchingResultDto } from "../../schemas";
import { runMatching } from "../../server/actions";
import { CampaignSelector } from "../filters/CampaignSelector";
import { MarketplaceProvider } from "../MarketplaceProvider";
import { MatchingPromptBox } from "./MatchingPromptBox";
import { MatchingResults } from "./MatchingResults";
import { NaoRail } from "./NaoRail";
import { SuggestedChips } from "./SuggestedChips";

type Props = { ctx: MarketplaceContextDto };

function defaultPrompt(ctx: MarketplaceContextDto) {
  const name = ctx.selectedCampaign?.name ?? `${ctx.company} creator brief`;
  return `Find 4 creators for ${name}. Use my campaign brief and prioritize strong audience and content fit.`;
}

function suggestionsFor(ctx: MarketplaceContextDto) {
  const icp = ctx.icpTitles[0];
  const industry = ctx.targetIndustries[0];
  return [
    icp ? `Find creators who already reach ${icp}` : null,
    industry ? `Find creators with credible content about ${industry}` : null,
    `Build a balanced creator shortlist for ${ctx.company}`,
  ].filter(Boolean) as string[];
}

function Thinking({ requested }: { requested: number }) {
  return (
    <div className="grid gap-3 rounded-2xl border bg-background p-4 text-sm" aria-busy="true" aria-live="polite">
      <p className="text-muted-foreground">Got it — I&apos;m searching for {requested} creators that fit your request.</p>
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}

export function MatchingView({ ctx }: Props) {
  const [prompt, setPrompt] = useState(defaultPrompt(ctx));
  const [asked, setAsked] = useState<string | null>(null);
  const [result, setResult] = useState<MatchingResultDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const requested = Number(/\b(\d{1,2})\s+creators?\b/i.exec(prompt)?.[1] ?? "4");

  async function run(text = prompt) {
    if (!ctx.selectedCampaign) return;
    setPending(true);
    setError(null);
    setAsked(text);
    const response = await runMatching({ campaignId: ctx.selectedCampaign.id, prompt: text });
    setPending(false);
    if (!response.ok) {
      setError(response.error);
      setResult(null);
      return;
    }
    setResult(response.data);
  }

  function reset() {
    setResult(null);
    setAsked(null);
    setError(null);
    setPrompt(defaultPrompt(ctx));
  }

  if (!ctx.selectedCampaign) {
    return (
      <EmptyState
        title="Nao needs a campaign brief"
        body="Create a campaign so Nao can rank creators against its audience and angles."
        cta={{ href: "/brand/campaigns", label: "Create a campaign" }}
      />
    );
  }

  return (
    <MarketplaceProvider ctx={ctx}>
      <div className="grid gap-6 lg:grid-cols-[1fr_16rem]">
        <section className="grid gap-5">
          <div className="rounded-3xl bg-gradient-to-b from-brand/10 to-transparent px-6 pt-8 pb-4 text-center">
            <Cloud className="animate-float mx-auto size-10 text-brand" aria-hidden="true" />
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">Hey {ctx.company}, let&apos;s find the right creators for you.</h2>
            <div className="mx-auto mt-4 flex max-w-md justify-center">
              <CampaignSelector campaigns={ctx.campaigns} selected={ctx.selectedCampaign} />
            </div>
          </div>
          {asked ? pending ? <Thinking requested={requested} /> : result ? <MatchingResults prompt={asked} result={result} /> : null : null}
          {error ? (
            <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}
          <MatchingPromptBox value={prompt} onChange={setPrompt} onSubmit={() => run()} pending={pending} />
          {!result ? <SuggestedChips suggestions={suggestionsFor(ctx)} onPick={(text) => { setPrompt(text); void run(text); }} disabled={pending} /> : null}
        </section>
        <NaoRail onNewResearch={reset} onRetry={asked ? () => run(asked) : undefined} pending={pending} hasResult={result !== null} />
      </div>
    </MarketplaceProvider>
  );
}
