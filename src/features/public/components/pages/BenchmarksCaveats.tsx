import { BENCHMARKS } from "../../benchmarks-data";

// Time-to-launch, caveats and citation: the tail of the benchmark report.
export function BenchmarksCaveats() {
  const b = BENCHMARKS;
  return (
    <>
      <section className="border-t py-12">
        <h2 className="text-3xl font-semibold tracking-tight">Time-to-launch distribution</h2>
        <dl className="mt-6 grid grid-cols-3 gap-4">
          {b.timeToLaunch.map((item) => (
            <div key={item.label} className="rounded-2xl bg-card p-5 text-center ring-1 ring-border/60">
              <dd className="text-2xl font-bold tracking-tight">{item.value}</dd>
              <dt className="mt-1 text-xs text-muted-foreground">{item.label}</dt>
            </div>
          ))}
        </dl>
      </section>
      <section className="border-t py-12">
        <h2 className="text-3xl font-semibold tracking-tight">Limitations and caveats</h2>
        <ul className="mt-6 list-disc space-y-2 pl-5 text-foreground/80">
          {b.caveats.map((caveat) => (
            <li key={caveat}>{caveat}</li>
          ))}
        </ul>
        <h2 className="mt-12 text-3xl font-semibold tracking-tight">How to cite</h2>
        <p className="mt-4 rounded-xl bg-muted/60 p-4 font-mono text-sm">{b.cite}</p>
      </section>
    </>
  );
}
