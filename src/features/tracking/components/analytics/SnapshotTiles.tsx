import type { PublicSnapshot } from "../../server/creator-queries";

const PERCENT = 100;

function Tile({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="card-lift card-invert rounded-2xl border bg-background p-5">
      <p className="text-xs font-semibold text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

export function SnapshotTiles({ snapshot }: { snapshot: PublicSnapshot }) {
  const share = snapshot.posts > 0 ? Math.round((snapshot.postsWithReach / snapshot.posts) * PERCENT) : 0;
  return (
    <>
      <section className="rounded-2xl border bg-gradient-to-r from-brand/10 via-background to-background p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">● Public LinkedIn snapshot</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Public LinkedIn posts are imported</h2>
            <p className="text-sm text-muted-foreground">The profile is ready. Post history and reach below come from the public-data import.</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-semibold">{share}%</p>
            <p className="text-xs text-muted-foreground">of imported posts include reach data</p>
          </div>
        </div>
      </section>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Tile label="Public posts" value={snapshot.posts.toLocaleString("en-US")} hint="Original LinkedIn posts found" />
        <Tile label="Public post reach" value={snapshot.reach.toLocaleString("en-US")} hint="Impressions across imported posts" />
        <Tile label="Public engagements" value={snapshot.engagements.toLocaleString("en-US")} hint="Reactions, comments and reposts" />
        <Tile label="LinkedIn followers" value={snapshot.followers.toLocaleString("en-US")} hint="Imported from the public profile" />
      </div>
    </>
  );
}
