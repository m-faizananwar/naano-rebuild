import { AnimatedStat } from "@/components/motion/AnimatedStat";

export function StatTile({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="card-lift rounded-2xl border bg-background p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight"><AnimatedStat value={value} /></p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}
