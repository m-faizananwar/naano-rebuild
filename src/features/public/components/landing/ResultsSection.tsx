import { RESULTS } from "../../constants";
import { SectionHeading } from "../shared/SectionHeading";
import { StatTile } from "../shared/StatTile";

export function ResultsSection() {
  return (
    <section className="bg-background px-4 py-24 sm:px-6">
      <SectionHeading eyebrow={RESULTS.eyebrow} title={RESULTS.title} />
      <div className="mx-auto mt-12 max-w-6xl rounded-[2rem] bg-linear-to-b from-brand-soft/70 to-background p-4 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {RESULTS.stats.map((stat) => (
            <StatTile key={stat.label} value={stat.value} label={stat.label} />
          ))}
        </div>
      </div>
    </section>
  );
}
