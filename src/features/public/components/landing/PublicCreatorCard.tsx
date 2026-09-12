import { formatCents } from "@/lib/money";
import type { PublicCreator } from "../../constants";
import { CreatorAvatar } from "../shared/CreatorAvatar";
import { LinkedInMark } from "../shared/LinkedInMark";

const K = 1000;
function short(n: number) {
  return n >= K ? `${(n / K).toFixed(1).replace(/\.0$/, "")}K` : String(n);
}

// Compact read-only version of the marketplace creator card for the landing page.
export function PublicCreatorCard({ creator, rank }: { creator: PublicCreator; rank: number }) {
  return (
    <article className="relative overflow-hidden rounded-2xl bg-card text-card-foreground shadow-sm ring-1 ring-border/70">
      <div className="relative h-16 bg-linear-to-br from-brand-sky to-brand-soft">
        <span aria-hidden="true" className="absolute left-3 top-2 text-3xl font-bold text-brand/15">
          {rank}
        </span>
        <span className="absolute left-3 top-3 inline-flex size-6 items-center justify-center rounded-md bg-background shadow-sm">
          <LinkedInMark label="LinkedIn creator" />
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-background px-2.5 py-1 text-[0.65rem] font-semibold shadow-sm">Book</span>
      </div>
      <div className="-mt-8 flex flex-col items-center px-4 text-center">
        <CreatorAvatar name={creator.name} src={creator.avatarUrl} className="size-16 ring-4 ring-card" />
        <h3 className="mt-2 text-sm font-semibold">{creator.name}</h3>
        <p className="text-xs text-muted-foreground">{creator.industries.slice(0, 3).join(" · ")}</p>
        <p className="mt-2 line-clamp-2 text-xs text-foreground/70">{creator.headline}</p>
      </div>
      <div className="mt-3 px-4">
        <div className="flex items-center justify-between text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
            Matching
          </span>
          <span className="text-foreground">{creator.fit}/100</span>
        </div>
        <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-muted" role="meter" aria-valuenow={creator.fit} aria-valuemin={0} aria-valuemax={100} aria-label="Audience fit">
          <div className="h-full rounded-full bg-brand" style={{ width: `${creator.fit}%` }} />
        </div>
      </div>
      <dl className="mt-3 grid grid-cols-3 divide-x border-t bg-muted/40 text-center">
        {[
          ["Followers", short(creator.followers)],
          ["Median views", short(creator.medianViews)],
          ["Post cost", formatCents(creator.priceCents, "EUR", "en-IE").replace(/\.00$/, "")],
        ].map(([label, value]) => (
          <div key={label} className="px-2 py-2.5">
            <dd className="text-sm font-semibold">{value}</dd>
            <dt className="text-[0.6rem] uppercase tracking-wider text-muted-foreground">{label}</dt>
          </div>
        ))}
      </dl>
    </article>
  );
}
