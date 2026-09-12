"use client";

import { QUICK_REACTIONS } from "../../ui-constants";

// Twelve one-tap reactions; they drop the emoji into the composer.
export function QuickReactions({ onPick }: { onPick: (emoji: string) => void }) {
  return (
    <div role="group" aria-label="Quick reactions" className="flex flex-wrap gap-1">
      {QUICK_REACTIONS.map((emoji) => (
        <button
          key={emoji}
          type="button"
          onClick={() => onPick(emoji)}
          aria-label={`React with ${emoji}`}
          className="flex size-8 items-center justify-center rounded-full text-base transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}
