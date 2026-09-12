"use client";

import { ArrowUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { BRIEF_PROMPT_MAX_CHARS } from "../../constants";
import { createCampaignFromAi } from "../../server/actions";

const EXAMPLE = "I want to reach VP Sales in B2B SaaS in France.";

// The "Create with AI" chat: one prompt in, one draft campaign out, then the
// stepper takes over.
export function AiComposer() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit() {
    if (!prompt.trim() || pending) return;
    setError(null);
    startTransition(async () => {
      const result = await createCampaignFromAi({ prompt });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      toast.success(result.data.generatedWith === "ai" ? "Brief generated with AI" : "Brief prepared from a template");
      router.push(`/brand/campaigns/${result.data.campaignId}/launch?generated=${result.data.generatedWith}`);
    });
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
      className="rounded-2xl border bg-background p-4"
    >
      <label htmlFor="ai-prompt" className="sr-only">
        Describe your campaign
      </label>
      <Textarea
        id="ai-prompt"
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            submit();
          }
        }}
        placeholder="Let's build this campaign together…"
        maxLength={BRIEF_PROMPT_MAX_CHARS}
        rows={4}
        disabled={pending}
        className="min-h-28 resize-none border-0 bg-transparent p-0 text-base shadow-none focus-visible:ring-0"
      />
      <div className="mt-3 flex items-end justify-between gap-3">
        <button type="button" onClick={() => setPrompt(EXAMPLE)} className="text-left text-xs text-muted-foreground hover:text-foreground hover:underline">
          Try: “{EXAMPLE}”
        </button>
        <button
          type="submit"
          aria-label="Generate the campaign"
          disabled={pending || prompt.trim().length === 0}
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand text-brand-foreground transition-opacity disabled:opacity-40"
        >
          <ArrowUp className={`size-5 ${pending ? "animate-pulse" : ""}`} aria-hidden="true" />
        </button>
      </div>
      {pending ? <p className="mt-3 text-sm text-muted-foreground">Preparing your brief…</p> : null}
      {error ? (
        <p role="alert" className="mt-3 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </form>
  );
}
