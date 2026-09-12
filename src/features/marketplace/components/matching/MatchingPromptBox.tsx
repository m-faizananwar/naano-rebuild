"use client";

import { ArrowUp } from "lucide-react";
import { type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MATCHING_PROMPT_MAX_LENGTH } from "../../constants";

import { BRAND } from "@/config/brand";
type Props = { value: string; onChange: (value: string) => void; onSubmit: () => void; pending: boolean; placeholder?: string };

export function MatchingPromptBox({ value, onChange, onSubmit, pending, placeholder }: Props) {
  function submit(event: FormEvent) {
    event.preventDefault();
    if (!pending && value.trim()) onSubmit();
  }
  return (
    <form onSubmit={submit} className="relative rounded-2xl border bg-background p-3 shadow-xs focus-within:border-brand">
      <label htmlFor="copilot-prompt" className="sr-only">
        Ask {BRAND.copilot} to find creators
      </label>
      <Textarea
        id="copilot-prompt"
        value={value}
        maxLength={MATCHING_PROMPT_MAX_LENGTH}
        rows={3}
        placeholder={placeholder ?? `Ask ${BRAND.copilot} a question, or find creators…`}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) submit(e);
        }}
        className="min-h-20 resize-none border-0 bg-transparent p-0 pr-12 shadow-none focus-visible:ring-0"
      />
      <Button type="submit" size="icon" aria-label={`Send to ${BRAND.copilot}`} disabled={pending || !value.trim()} className="absolute right-3 bottom-3 rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
        <ArrowUp className="size-4" aria-hidden="true" />
      </Button>
    </form>
  );
}
