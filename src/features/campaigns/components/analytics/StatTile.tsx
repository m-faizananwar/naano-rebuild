type Props = { label: string; value: string; hint: string };

export function StatTile({ label, value, hint }: Props) {
  return (
    <div className="rounded-2xl border bg-background p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}
