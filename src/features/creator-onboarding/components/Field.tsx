import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";

type Props = { id: string; label: string; hint?: string; error?: string; children: ReactNode };

export const INPUT_CLASS = "h-12 rounded-xl px-4";
export const SELECT_CLASS =
  "h-12 w-full rounded-xl border border-input bg-background px-4 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function Field({ id, label, hint, error, children }: Props) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id} className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </Label>
      {children}
      {hint && !error ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
