"use client";

import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type BriefDoc, briefToAiPrompt } from "@/lib/brief-markdown";
import { useCopyToClipboard } from "./useCopyToClipboard";

export function CopyForAiButton({ brief }: { brief: BriefDoc }) {
  const copy = useCopyToClipboard();
  return (
    <Button
      type="button"
      className="shrink-0 bg-brand text-brand-foreground hover:bg-brand/90"
      onClick={() => copy(briefToAiPrompt(brief), "Prompt copied — paste it into your AI")}
    >
      <Sparkles data-icon="inline-start" aria-hidden="true" />
      Copy for my AI
    </Button>
  );
}
