"use client";

import type React from "react";
import { Copy, ThumbsDown, ThumbsUp } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { MatchingResultDto } from "../../schemas";
import { recordNaoFeedback } from "../../server/actions";
import { MatchingResultRow } from "./MatchingResultRow";
import { StagedResults } from "./StagedResults";

import { BRAND } from "@/config/brand";
type Props = { prompt: string; result: MatchingResultDto };

export function MatchingResults({ prompt, result }: Props) {
  const text = `${result.headline}\n\n${result.rationale}\n\n${result.tradeoff}`;
  const creatorIds = result.creators.map((c) => c.id);
  async function feedback(kind: "up" | "down" | "copy") {
    if (kind === "copy") await navigator.clipboard.writeText(text).catch(() => undefined);
    const saved = await recordNaoFeedback({ prompt, kind, creatorIds });
    if (!saved.ok) {
      toast.error(saved.error);
      return;
    }
    toast.success(kind === "copy" ? "Copied — and noted" : kind === "up" ? `Thanks — ${BRAND.copilot} will favour this kind of shortlist` : `Thanks — ${BRAND.copilot} will steer away from this`);
  }
  return (
    <div className="grid gap-4">
      <p className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-brand px-4 py-2 text-sm text-brand-foreground">{prompt}</p>
      <div className="grid gap-3 rounded-2xl border bg-background p-4 text-sm">
        <StagedResults intro={result.intro}>
        <p className="font-semibold">{result.headline}</p>
        <p>{result.rationale}</p>
        <p className="text-muted-foreground">{result.tradeoff}</p>
        <div className="flex items-center gap-1 text-muted-foreground [&>button]:opacity-70 [&>button:hover]:opacity-100">
          <Button type="button" variant="ghost" size="icon-xs" aria-label={`Copy ${BRAND.copilot}'s answer`} onClick={() => feedback("copy")}>
            <Copy aria-hidden="true" />
          </Button>
          <Button type="button" variant="ghost" size="icon-xs" aria-label="Good answer" onClick={() => feedback("up")}>
            <ThumbsUp aria-hidden="true" />
          </Button>
          <Button type="button" variant="ghost" size="icon-xs" aria-label="Bad answer" onClick={() => feedback("down")}>
            <ThumbsDown aria-hidden="true" />
          </Button>
          <span className="ml-auto text-[10px] uppercase tracking-wider">{result.source === "claude" ? `Written by ${BRAND.copilot}` : "Template rationale"}</span>
        </div>
        </StagedResults>
      </div>
      <section className="rounded-2xl border bg-background p-4">
        <h3 className="font-semibold">{BRAND.copilot}&apos;s selection</h3>
        <p className="text-xs text-muted-foreground">Creators selected for your request</p>
        {result.creators.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">No creator matched. Try a broader request.</p>
        ) : (
          <ol style={{ "--stagger": "80ms" } as React.CSSProperties} className="stagger mt-4 grid gap-2 [&>*]:[animation-delay:calc(2.2s+var(--stagger)*var(--i))]">
            {result.creators.map((creator, i) => (
              <MatchingResultRow key={creator.id} creator={creator} rank={i + 1} index={i} />
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
