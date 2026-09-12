"use client";

import { Copy, ThumbsDown, ThumbsUp } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { MatchingResultDto } from "../../schemas";
import { MatchingResultRow } from "./MatchingResultRow";

type Props = { prompt: string; result: MatchingResultDto };

export function MatchingResults({ prompt, result }: Props) {
  const text = `${result.headline}\n\n${result.rationale}\n\n${result.tradeoff}`;
  return (
    <div className="grid gap-4">
      <p className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-brand px-4 py-2 text-sm text-brand-foreground">{prompt}</p>
      <div className="grid gap-3 rounded-2xl border bg-background p-4 text-sm">
        <p className="text-muted-foreground">{result.intro}</p>
        <p className="font-semibold">{result.headline}</p>
        <p>{result.rationale}</p>
        <p className="text-muted-foreground">{result.tradeoff}</p>
        <div className="flex items-center gap-1 text-muted-foreground">
          <Button type="button" variant="ghost" size="icon-xs" aria-label="Copy Nao's answer" onClick={() => navigator.clipboard.writeText(text).then(() => toast.success("Copied"))}>
            <Copy aria-hidden="true" />
          </Button>
          <Button type="button" variant="ghost" size="icon-xs" aria-label="Good answer" onClick={() => toast.success("Thanks for the feedback")}>
            <ThumbsUp aria-hidden="true" />
          </Button>
          <Button type="button" variant="ghost" size="icon-xs" aria-label="Bad answer" onClick={() => toast.success("Thanks for the feedback")}>
            <ThumbsDown aria-hidden="true" />
          </Button>
          <span className="ml-auto text-[10px] uppercase tracking-wider">{result.source === "claude" ? "Written by Nao" : "Template rationale"}</span>
        </div>
      </div>
      <section className="rounded-2xl border bg-background p-4">
        <h3 className="font-semibold">Nao&apos;s selection</h3>
        <p className="text-xs text-muted-foreground">Creators selected for your request</p>
        {result.creators.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">No creator matched. Try a broader request.</p>
        ) : (
          <ol className="mt-4 grid gap-2">
            {result.creators.map((creator, i) => (
              <MatchingResultRow key={creator.id} creator={creator} rank={i + 1} />
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
