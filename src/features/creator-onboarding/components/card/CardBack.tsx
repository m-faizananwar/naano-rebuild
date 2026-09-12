import { ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { countryName } from "@/lib/country-flag";
import type { CardModel } from "./toCardModel";

const PERCENT = 100;
const RATE_DECIMALS = 1;
// Public reactions vs comments split of the engagements we estimate.
const REACTIONS_SHARE = 0.85;
// Estimated share of the audience in the dominant theme, by number of themes
// picked (naano showed 71% for a three-industry creator).
const TOP_SHARE_BY_COUNT = [PERCENT, 78, 71];

function estimate(model: CardModel) {
  const engagements = (model.medianViews ?? 0) * model.engagementRate;
  return {
    reactions: Math.round(engagements * REACTIONS_SHARE),
    comments: Math.round(engagements * (1 - REACTIONS_SHARE)),
    rate: `${(model.engagementRate * PERCENT).toFixed(RATE_DECIMALS)}%`,
  };
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted p-3">
      <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm font-semibold tabular-nums">{value}</dd>
    </div>
  );
}

function Target({ model }: { model: CardModel }) {
  const topIndustry = model.industries[0];
  const share = TOP_SHARE_BY_COUNT[Math.min(model.industries.length, TOP_SHARE_BY_COUNT.length) - 1] ?? PERCENT;
  return (
    <div className="mt-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Who you target (est.)</p>
      <p className="text-xs text-muted-foreground">Estimated from your public posts + bio (dominant themes)</p>
      <dl className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
        <div className="flex items-baseline gap-1.5">
          <dt className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Industry</dt>
          <dd className="font-semibold">{topIndustry ? `${topIndustry} ${share}%` : "—"}</dd>
        </div>
        <div className="flex items-baseline gap-1.5">
          <dt className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Location</dt>
          <dd className="font-semibold">{model.country ? `${countryName(model.country)} ${PERCENT}%` : "—"}</dd>
        </div>
      </dl>
    </div>
  );
}

// "More details": Performance & ICP, the back of the marketplace card.
export function CardBack({ model, onBack }: { model: CardModel; onBack: () => void }) {
  const known = model.followers !== null;
  const est = estimate(model);
  return (
    <div className="overflow-hidden rounded-[2rem] bg-card p-6 shadow-xl ring-1 ring-border/60">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand">Performance &amp; ICP</p>
      <p className="mt-1 text-xs text-muted-foreground">Public LinkedIn profile data from Apify (Basic card)</p>
      <dl className="mt-4 grid grid-cols-2 gap-2">
        <Tile label="Followers" value={known ? (model.followers ?? 0).toLocaleString("en-US") : "—"} />
        <Tile label="Reactions per post (avg)" value={known ? String(est.reactions) : "—"} />
        <Tile label="Typical impressions per post" value={known ? (model.medianViews ?? 0).toLocaleString("en-US") : "—"} />
        <Tile label="Comments per post (avg)" value={known ? String(est.comments) : "—"} />
        <Tile label="Engagement rate" value={known ? est.rate : "—"} />
      </dl>
      <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-xs font-medium text-brand">
        <ShieldCheck className="size-3.5" aria-hidden="true" />
        Public LinkedIn data estimated by Naano
      </p>
      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">About</p>
        <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">{model.bio || model.headline || "Your bio will appear here once you add one from your Naano profile."}</p>
      </div>
      <Target model={model} />
      <div className="mt-5 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-full border bg-card px-4 py-1.5 text-xs font-semibold transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          Back
        </button>
        {model.handle ? (
          <Link href={`/c/${model.handle}`} className={buttonVariants({ size: "sm", className: "rounded-full bg-brand text-brand-foreground hover:bg-brand/90" })}>
            View profile
          </Link>
        ) : null}
      </div>
    </div>
  );
}
