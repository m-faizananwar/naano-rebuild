import { StaggerIn } from "@/components/motion/StaggerIn";
import { TOP_RANKED } from "../../constants";
import type { CreatorDto } from "../../schemas";
import { CreatorCard } from "./CreatorCard";

function Grid({ creators, label }: { creators: CreatorDto[]; label: string }) {
  // The id set as replay key: the 30ms anime stagger runs again whenever a filter changes the result.
  const setKey = creators.map((c) => c.id).join(",");
  return (
    <StaggerIn as="ul" replayKey={setKey} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label={label}>
      {creators.map((creator) => (
        <li key={creator.id} className="flex">
          <div className="flex w-full">
            <CreatorCard creator={creator} />
          </div>
        </li>
      ))}
    </StaggerIn>
  );
}

// naano's ranked view: the 40 strongest profiles first, the rest under a divider.
export function CreatorGrid({ creators, topRanked = 0 }: { creators: CreatorDto[]; topRanked?: number }) {
  if (topRanked <= 0) return <Grid creators={creators} label="Creators" />;
  const top = creators.slice(0, topRanked);
  const rest = creators.slice(topRanked);
  return (
    <div className="grid gap-6">
      <section aria-labelledby="top-ranked-title">
        <div className="mb-3">
          <h2 id="top-ranked-title" className="font-semibold">Top ranked creators</h2>
          <p className="text-sm text-muted-foreground">The {TOP_RANKED} strongest profiles according to your sector and performance signals.</p>
        </div>
        <Grid creators={top} label="Top ranked creators" />
      </section>
      {rest.length > 0 ? (
        <section aria-labelledby="all-creators-title">
          <div className="mb-3 flex items-center gap-3">
            <h2 id="all-creators-title" className="font-semibold">All creators</h2>
            <span className="h-px flex-1 bg-border" aria-hidden="true" />
          </div>
          <Grid creators={rest} label="All creators" />
        </section>
      ) : null}
    </div>
  );
}
