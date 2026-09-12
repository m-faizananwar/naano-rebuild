import type { CreatorDto } from "../../schemas";
import { AudienceBars } from "./AudienceBars";

export function AudienceSnapshot({ creator }: { creator: CreatorDto }) {
  return (
    <section className="rounded-2xl border bg-background p-4">
      <h3 className="font-semibold">Audience snapshot</h3>
      <p className="text-xs text-muted-foreground">Estimated from {creator.engagerSample} recent public engagers</p>
      <div className="mt-4 grid gap-6 sm:grid-cols-2">
        <AudienceBars title="Job title" mix={creator.audienceJobTitles} />
        <AudienceBars title="Seniority" mix={creator.audienceSeniority} />
      </div>
    </section>
  );
}
