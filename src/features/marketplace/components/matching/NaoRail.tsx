"use client";

import { Bot, Play, RotateCcw, Sparkles, Square, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import { BRAND } from "@/config/brand";
type Props = {
  onNewResearch: () => void;
  onRetry?: () => void;
  onApply: () => void;
  onStop: () => void;
  onUndo?: () => void;
  pending: boolean;
  hasResult: boolean;
};

// "Nao · Creator intelligence" — New research / Retry this search / Undo / Stop / Apply request.
export function NaoRail({ onNewResearch, onRetry, onApply, onStop, onUndo, pending, hasResult }: Props) {
  return (
    <aside className="rounded-2xl border bg-background p-4" aria-label={`${BRAND.copilot}`}>
      <p className="flex items-center gap-2 text-sm font-semibold">
        <span className="flex size-8 items-center justify-center rounded-full bg-brand/10 text-brand">
          <Bot className="size-4" aria-hidden="true" />
        </span>
        {BRAND.copilot} <span className="font-normal text-muted-foreground">· Creator intelligence</span>
      </p>
      <p className="mt-3 text-xs text-muted-foreground">
        {BRAND.copilot} ranks every creator against your campaign brief — audience overlap first, then category, engagement and consistency — and writes up
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
        <Button type="button" variant="ghost" size="sm" onClick={onUndo} disabled={pending || !onUndo} title="Restore the previous result set">
          <Undo2 aria-hidden="true" />
          Undo
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onStop} disabled={!pending} title="Cancel the request in flight">
          <Square aria-hidden="true" />
          Stop
        </Button>
        <Button type="button" size="sm" onClick={onApply} disabled={pending} className="bg-brand text-brand-foreground hover:bg-brand/90">
          <Play aria-hidden="true" />
          Apply request
        </Button>
      </div>
    </aside>
  );
}
