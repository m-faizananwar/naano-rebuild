import type { ReactNode } from "react";

// One boxed section of the brief drawer: an uppercase eyebrow + body.
export function BriefSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border bg-background p-5">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
      <div className="space-y-2 text-sm leading-relaxed text-foreground">{children}</div>
    </section>
  );
}
