import { type PublicCreator, SHOWCASE, STATIC_SHOWCASE_CREATORS } from "../../constants";
import { SectionHeading } from "../shared/SectionHeading";
import { PublicCreatorCard } from "./PublicCreatorCard";
import { ShowcaseStatCard } from "./ShowcaseStatCard";

import { BRAND } from "@/config/brand";
export function MarketplaceShowcase({ creators }: { creators: PublicCreator[] }) {
  const list = creators.length > 0 ? creators : STATIC_SHOWCASE_CREATORS;
  const illustrative = creators.length === 0;
  return (
    <section className="bg-background px-4 pb-24 sm:px-6">
      <SectionHeading eyebrow={SHOWCASE.eyebrow} title={SHOWCASE.title} sub={SHOWCASE.sub} />
      <div className="relative mx-auto mt-14 max-w-6xl">
        <div className="rounded-[2rem] bg-linear-to-b from-brand-sky to-brand-soft p-3 pt-10 sm:p-6 sm:pt-14">
          <div className="overflow-hidden rounded-2xl bg-background shadow-xl ring-1 ring-border/60">
            <div className="flex items-center gap-2 border-b px-4 py-2.5">
              <span aria-hidden="true" className="flex gap-1">
                <span className="size-2 rounded-full bg-muted-foreground/30" />
                <span className="size-2 rounded-full bg-muted-foreground/30" />
                <span className="size-2 rounded-full bg-muted-foreground/30" />
              </span>
              <span className="mx-auto rounded-md bg-muted px-3 py-1 text-[0.7rem] text-muted-foreground">{BRAND.wordmark}.co/marketplace</span>
            </div>
            <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 sm:p-6">
              {list.map((creator, index) => (
                <PublicCreatorCard key={creator.id} creator={creator} rank={index + 1} />
              ))}
            </div>
            {illustrative ? (
              <p className="border-t px-6 py-3 text-center text-xs text-muted-foreground">Illustrative profiles — connect a database to show seeded creators.</p>
            ) : null}
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {SHOWCASE.stats.map((stat) => (
            <ShowcaseStatCard key={stat.title} title={stat.title} body={stat.body} kind={stat.kind} />
          ))}
        </div>
      </div>
    </section>
  );
}
