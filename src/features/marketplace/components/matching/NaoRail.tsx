"use client";

import { Bot, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = { onNewResearch: () => void; onRetry?: () => void; pending: boolean; hasResult: boolean };

// "Nao · Creator intelligence" — New research / Retry this search.
export function NaoRail({ onNewResearch, onRetry, pending, hasResult }: Props) {
  return (
    <aside className="rounded-2xl border bg-background p-4" aria-label="Nao">
      <p className="flex items-center gap-2 text-sm font-semibold">
        <span className="flex size-8 items-center justify-center rounded-full bg-brand/10 text-brand">
          <Bot className="size-4" aria-hidden="true" />
        </span>
        Nao <span className="font-normal text-muted-foreground">· Creator intelligence</span>
      </p>
      <p className="mt-3 text-xs text-muted-foreground">
        Nao ranks every creator against your campaign brief — audience overlap first, then category, engagement and consistency — and writes up
        the selection.
      </p>
      <div className="mt-4 grid gap-2">
        <Button type="button" variant="outline" size="sm" onClick={onNewResearch} disabled={pending}>
          <Sparkles aria-hidden="true" />
          New research
        </Button>
        {hasResult && onRetry ? (
          <Button type="button" variant="ghost" size="sm" onClick={onRetry} disabled={pending}>
            <RotateCcw aria-hidden="true" />
            Retry this search
          </Button>
        ) : null}
      </div>
    </aside>
  );
}
