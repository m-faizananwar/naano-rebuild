"use client";

type Props = { options: readonly string[]; value: string[]; onChange: (next: string[]) => void; max?: number; label: string };

export function ChipSelect({ options, value, onChange, max, label }: Props) {
  function toggle(option: string) {
    if (value.includes(option)) onChange(value.filter((v) => v !== option));
    else if (!max || value.length < max) onChange([...value, option]);
  }
  return (
    <fieldset>
      <legend className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
        {max ? ` (pick up to ${max})` : ""}
      </legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={value.includes(option)}
            onClick={() => toggle(option)}
            className="rounded-full border px-3 py-1 text-sm transition-colors hover:bg-muted aria-pressed:border-brand aria-pressed:bg-brand/10 aria-pressed:text-brand"
          >
            {option}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
