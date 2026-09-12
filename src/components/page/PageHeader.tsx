import type { ReactNode } from "react";

type Props = { title: string; description?: string; actions?: ReactNode; eyebrow?: string };

export function PageHeader({ title, description, actions, eyebrow }: Props) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{eyebrow}</p> : null}
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        {description ? <p className="mt-1 max-w-2xl text-muted-foreground">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 gap-2">{actions}</div> : null}
    </div>
  );
}
