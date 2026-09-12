import type { CreatorDto } from "../../schemas";
import { FitPill } from "../cards/FitPill";

const PERCENT = 100;

// The fit % with its four signals and the one-line reason from fitScore().
export function FitBreakdown({ creator, campaignName }: { creator: CreatorDto; campaignName: string | null }) {
  return (
    <section className="rounded-2xl border bg-background p-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="font-semibold">Fit breakdown</h3>
          <p className="text-xs text-muted-foreground">{campaignName ? `Against ${campaignName}` : "Pick a campaign to score against"}</p>
        </div>
        <FitPill score={creator.fit.score} />
      </div>
      <ul className="mt-4 grid gap-3">
        {creator.fit.signals.map((s) => (
          <li key={s.key} className="text-sm">
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium">{s.label}</span>
              <span className="tabular-nums text-muted-foreground">
                {s.score} · weight {Math.round(s.weight * PERCENT)}%
              </span>
            </div>
            <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden="true">
              <span className="block h-full rounded-full bg-brand" style={{ width: `${s.score}%` }} />
            </span>
            <p className="mt-1 text-xs text-muted-foreground">{s.detail}</p>
          </li>
        ))}
      </ul>
      <p className="mt-4 rounded-lg bg-brand/5 px-3 py-2 text-sm text-foreground">{creator.fit.reason}</p>
    </section>
  );
}
