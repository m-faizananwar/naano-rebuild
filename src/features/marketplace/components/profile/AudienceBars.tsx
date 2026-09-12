type Props = { title: string; mix: Record<string, number> };

// Horizontal percentage bars, largest first — JOB TITLE and SENIORITY.
export function AudienceBars({ title, mix }: Props) {
  const rows = Object.entries(mix).sort((a, b) => b[1] - a[1]);
  return (
    <div>
      <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</h4>
      {rows.length === 0 ? <p className="text-sm text-muted-foreground">No data yet.</p> : null}
      <ul className="grid gap-2">
        {rows.map(([label, pct]) => (
          <li key={label} className="grid grid-cols-[6.5rem_1fr_2.5rem] items-center gap-2 text-sm">
            <span className="truncate" title={label}>{label}</span>
            <span className="h-2 overflow-hidden rounded-full bg-muted" aria-hidden="true">
              <span className="block h-full rounded-full bg-brand" style={{ width: `${Math.min(100, pct)}%` }} />
            </span>
            <span className="text-right tabular-nums text-muted-foreground">{Math.round(pct)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
