import { INDUSTRIES } from "@/features/workspace/constants";
import { MAX_INDUSTRIES } from "../constants";

type Industry = (typeof INDUSTRIES)[number];
type Props = { value: Industry[]; onChange: (next: Industry[]) => void; error?: string };

// "Your industries (pick up to 3)": the 24 chips, toggle, max three.
export function IndustryChips({ value, onChange, error }: Props) {
  const full = value.length >= MAX_INDUSTRIES;
  function toggle(industry: Industry) {
    if (value.includes(industry)) onChange(value.filter((i) => i !== industry));
    else if (!full) onChange([...value, industry]);
  }
  return (
    <fieldset className="grid gap-2">
      <legend className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Your industries (pick up to {MAX_INDUSTRIES})</legend>
      <div className="flex flex-wrap gap-2">
        {INDUSTRIES.map((industry) => {
          const selected = value.includes(industry);
          return (
            <button
              key={industry}
              type="button"
              aria-pressed={selected}
              disabled={!selected && full}
              onClick={() => toggle(industry)}
              className="rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 disabled:cursor-not-allowed disabled:opacity-50 aria-pressed:border-brand aria-pressed:bg-brand aria-pressed:text-brand-foreground"
            >
              {industry}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">{value.length} of {MAX_INDUSTRIES} selected</p>
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
