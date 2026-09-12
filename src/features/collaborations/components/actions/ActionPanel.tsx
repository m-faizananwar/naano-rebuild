import type { ReactNode } from "react";

type Props = { title: string; description?: string; children: ReactNode };

// The "what to do now" box on the detail page: one per allowed action.
export function ActionPanel({ title, description, children }: Props) {
  return (
    <section className="rounded-2xl border border-brand/30 bg-brand/5 p-5">
      <h2 className="font-semibold">{title}</h2>
      {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}
