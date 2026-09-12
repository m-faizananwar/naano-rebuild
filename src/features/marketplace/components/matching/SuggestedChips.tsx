"use client";

import { Sparkles } from "lucide-react";

type Props = { suggestions: string[]; onPick: (text: string) => void; disabled?: boolean };

export function SuggestedChips({ suggestions, onPick, disabled }: Props) {
  return (
    <div>
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Suggested for you</p>
      <ul className="flex flex-wrap gap-2">
        {suggestions.map((text) => (
          <li key={text}>
            <button
              type="button"
              disabled={disabled}
              onClick={() => onPick(text)}
              className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:border-brand hover:text-brand focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-50"
            >
              <Sparkles className="size-3 text-brand" aria-hidden="true" />
              {text}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
