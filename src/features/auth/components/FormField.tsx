import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";

type Props = { id: string; label: string; error?: string; children: ReactNode };

export function FormField({ id, label, error, children }: Props) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id} className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </Label>
      {children}
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
