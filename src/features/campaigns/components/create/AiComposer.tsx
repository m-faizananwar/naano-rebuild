"use client";

import { ArrowUp, Bot } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { TypingDots } from "@/components/motion/TypingDots";
import { Textarea } from "@/components/ui/textarea";
import { BRIEF_PROMPT_MAX_CHARS } from "../../constants";
import { createCampaignFromAi } from "../../server/actions";

import { BRAND } from "@/config/brand";
// "AI asks the right questions and prepares a fully editable brief": three
// questions, then the answers become the prompt the brief is drafted from.
const QUESTIONS = [
  { key: "selling", ask: "Let's build this campaign together. First — what are you selling? A sentence is enough.", placeholder: "e.g. An AI outbound workspace for early-stage SaaS teams", example: "An AI product studio that ships websites, web apps and AI features in 6-week fixed-price builds." },
  { key: "buyer", ask: "Who is the buyer you want these posts to reach?", placeholder: "e.g. VP Sales in B2B SaaS in France", example: "Founders and product leaders at 10–200 person SaaS companies in Europe." },
  { key: "goal", ask: "And what's the goal of the campaign — sign-ups, demos, awareness?", placeholder: "e.g. Book 20 demos this quarter", example: "Qualified demo requests from founders who just raised." },
] as const;
const ANSWER_MAX_CHARS = Math.floor(BRIEF_PROMPT_MAX_CHARS / QUESTIONS.length) - 20;

type Turn = { role: "copilot" | "you"; text: string };

function composePrompt(answers: string[]) {
  const [selling, buyer, goal] = answers;
  return `Goal: ${goal}. We are selling: ${selling}. The buyer: ${buyer}.`;
}

export function AiComposer() {
  const router = useRouter();
  const [answers, setAnswers] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const step = Math.min(answers.length, QUESTIONS.length - 1);
  const done = answers.length === QUESTIONS.length;
  const current = QUESTIONS[step];

  const turns: Turn[] = QUESTIONS.slice(0, answers.length + 1).flatMap((q, i) => {
    const t: Turn[] = [{ role: "copilot", text: q.ask }];
    if (answers[i]) t.push({ role: "you", text: answers[i] });
    return t;
  });

  function generate(all: string[]) {
    setError(null);
    startTransition(async () => {
      const result = await createCampaignFromAi({ prompt: composePrompt(all) });
      if (!result.ok) {
        setError(result.error);
        setAnswers(all.slice(0, -1));
        return;
      }
      toast.success(result.data.generatedWith === "ai" ? "Brief generated with AI" : "Brief prepared from a template");
      router.push(`/brand/campaigns/${result.data.campaignId}/launch?generated=${result.data.generatedWith}`);
    });
  }

  function submit() {
    const text = draft.trim();
    if (!text || pending || done) return;
    const next = [...answers, text];
    setAnswers(next);
    setDraft("");
    if (next.length === QUESTIONS.length) generate(next);
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
      className="grid gap-4 rounded-2xl border bg-background p-4"
    >
      <ol className="grid gap-2" aria-live="polite">
        {turns.map((turn, i) => (
          <li key={i} className={turn.role === "copilot" ? "animate-fade flex items-start gap-2" : "animate-fade flex justify-end"}>
            {turn.role === "copilot" ? (
              <>
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                  <Bot className="size-3.5" aria-hidden="true" />
                </span>
                <p className="max-w-[85%] rounded-2xl rounded-tl-sm bg-muted px-3 py-2 text-sm">{turn.text}</p>
              </>
            ) : (
              <p className="max-w-[85%] rounded-2xl rounded-br-sm bg-brand px-3 py-2 text-sm text-brand-foreground">{turn.text}</p>
            )}
          </li>
        ))}
        {pending ? (
          <li className="flex items-center gap-2 text-sm text-muted-foreground">
            <TypingDots label="Preparing your brief" /> Preparing your brief…
          </li>
        ) : null}
      </ol>
      {!done ? (
        <div>
          <label htmlFor="ai-answer" className="sr-only">
            {current.ask}
          </label>
          <Textarea
            id="ai-answer"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                submit();
              }
            }}
            placeholder={current.placeholder}
            maxLength={ANSWER_MAX_CHARS}
            rows={3}
            disabled={pending}
            className="min-h-20 resize-none border-0 bg-transparent p-0 text-base shadow-none focus-visible:ring-0"
          />
          <div className="mt-3 flex items-end justify-between gap-3">
            <button type="button" onClick={() => setDraft(current.example)} className="text-left text-xs text-muted-foreground hover:text-foreground hover:underline">
              Try: “{current.example}”
            </button>
            <button
              type="submit"
              aria-label={step === QUESTIONS.length - 1 ? "Generate the campaign" : "Answer and continue"}
              disabled={pending || draft.trim().length === 0}
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand text-brand-foreground transition-opacity disabled:opacity-40"
            >
              <ArrowUp className="size-5" aria-hidden="true" />
            </button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Question {step + 1} of {QUESTIONS.length}
          </p>
        </div>
      ) : null}
      {error ? (
        <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </form>
  );
}
