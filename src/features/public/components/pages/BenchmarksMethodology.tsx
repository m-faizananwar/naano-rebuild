import { BENCHMARKS } from "../../benchmarks-data";

// Methodology section of the benchmark report.
export function BenchmarksMethodology() {
  const b = BENCHMARKS;
  return (
    <section className="border-t py-12">
      <h2 className="text-3xl font-semibold tracking-tight">Methodology</h2>
      <ul className="mt-6 space-y-4">
        {b.methodology.map((item) => (
          <li key={item.label} className="flex gap-3 text-foreground/80">
            <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
            <span>
              <strong className="font-semibold text-foreground">{item.label}: </strong>
              {item.text}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
