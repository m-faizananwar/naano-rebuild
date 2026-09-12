import type { BriefAngleDoc } from "@/lib/brief-markdown";

export function BriefAngleCard({ index, angle }: { index: number; angle: BriefAngleDoc }) {
  return (
    <article className="rounded-xl border p-4">
      <div className="flex items-center gap-3">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-sm font-semibold text-brand">
          {index}
        </span>
        <h4 className="font-semibold">{angle.angle}</h4>
      </div>
      <dl className="mt-3 space-y-2 text-sm">
        <div>
          <dt className="font-medium text-muted-foreground">Hook</dt>
          <dd>{angle.hook}</dd>
        </div>
        <div>
          <dt className="font-medium text-muted-foreground">Editorial direction</dt>
          <dd>{angle.direction}</dd>
        </div>
        <div>
          <dt className="font-medium text-muted-foreground">Post example</dt>
          <dd className="whitespace-pre-line rounded-lg bg-muted/60 p-3">{angle.example}</dd>
        </div>
      </dl>
    </article>
  );
}
