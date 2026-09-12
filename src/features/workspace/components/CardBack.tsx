import type { PublicCard } from "../server/card-queries";

const PERCENT = 100;

function Bars({ title, mix }: { title: string; mix: Record<string, number> }) {
  const entries = Object.entries(mix).sort((a, b) => b[1] - a[1]);
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
      <ul className="mt-2 grid gap-1.5">
        {entries.map(([label, value]) => (
          <li key={label} className="grid grid-cols-[7rem_1fr_2.5rem] items-center gap-2 text-xs">
            <span className="truncate">{label}</span>
            <span className="h-1.5 rounded-full bg-muted"><span className="block h-1.5 rounded-full bg-brand" style={{ width: `${value}%` }} /></span>
            <span className="text-right font-medium">{value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// "More details" — performance & ICP, the back of the marketplace card.
export function CardBack({ card }: { card: PublicCard }) {
  const tiles = [
    ["Followers", card.followers.toLocaleString("en-US")],
    ["Reactions per post (avg)", String(card.reactionsPerPost)],
    ["Typical impressions per post", card.medianViews.toLocaleString("en-US")],
    ["Comments per post (avg)", String(card.commentsPerPost)],
    ["Engagement rate", `${(card.engagementRate * PERCENT).toFixed(1)}%`],
    ["Sponsored posts published", String(card.publishedCollaborations)],
  ];
  return (
    <section className="rounded-2xl border bg-background p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Performance &amp; ICP</p>
      <p className="text-xs text-muted-foreground">Public LinkedIn data estimated by Naano · {card.postsAnalyzed} posts analyzed</p>
      <dl className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {tiles.map(([label, value]) => (
          <div key={label} className="rounded-lg bg-muted p-3">
            <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</dt>
            <dd className="text-sm font-semibold">{value}</dd>
          </div>
        ))}
      </dl>
      {card.bio ? (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">About</p>
          <p className="mt-1 text-sm text-muted-foreground">{card.bio}</p>
        </div>
      ) : null}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Bars title="Who they reach (job titles)" mix={card.audienceJobTitles} />
        <Bars title="Seniority" mix={card.audienceSeniority} />
      </div>
    </section>
  );
}
