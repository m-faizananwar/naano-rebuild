export function StatTile({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl bg-background/80 px-6 py-8 text-center shadow-sm ring-1 ring-border/60">
      <p className="text-4xl font-bold tracking-tight sm:text-5xl">{value}</p>
      <p className="mt-2 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
