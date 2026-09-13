import { ArrowRight, CalendarDays, Package } from "lucide-react";
import { BrandLockup } from "@/components/brand/BrandLockup";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { countryFlag, countryName } from "@/lib/country-flag";
import { formatEuro } from "@/lib/format-euro";
import type { CardModel } from "./toCardModel";

import { BRAND } from "@/config/brand";
const PROGRESS_DONE = 100;

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-2 py-5 text-center">
      <dd data-stat className="text-xl font-bold tabular-nums [transform-style:preserve-3d]">{value}</dd>
      <dt className="mt-1 text-xs text-muted-foreground">{label}</dt>
    </div>
  );
}

function ReadingChip() {
  return (
    <span className="absolute inset-x-0 top-5 flex justify-center">
      <span className="animate-pulse-soft inline-flex items-center gap-2 rounded-full bg-card px-4 py-1.5 text-sm font-medium text-brand shadow-md" role="status">
        <span className="size-2 animate-pulse rounded-full bg-brand" aria-hidden="true" />
        Reading your profile…
      </span>
    </span>
  );
}

// The marketplace card as it appears on naano's onboarding: blue header,
// LinkedIn badge, flag once the country is confirmed, live stats.
export function CardFront({ model, onMore }: { model: CardModel; onMore: () => void }) {
  const flag = model.country ? countryFlag(model.country) : "";
  const pending = model.progress < PROGRESS_DONE;
  return (
    <div className="overflow-hidden rounded-[2rem] bg-card shadow-xl ring-1 ring-border/60">
      <div className="relative h-32 bg-linear-to-br from-brand to-brand/80">
        <span className="absolute left-5 top-5 inline-flex size-9 items-center justify-center rounded-lg bg-brand-foreground/90 text-sm font-bold text-brand" aria-label="LinkedIn">
          in
        </span>
        {flag ? (
          <span className="absolute right-5 top-5 inline-flex size-9 items-center justify-center rounded-lg bg-brand-foreground/90 text-xl" aria-label={countryName(model.country ?? "")}>
            {flag}
          </span>
        ) : null}
        <div className="absolute inset-x-0 top-9 flex justify-center">
          <BrandLockup size="sm" className="text-brand-foreground" />
        </div>
        {model.reading ? <ReadingChip /> : null}
      </div>
      <div className="-mt-10 flex flex-col items-center px-6 text-center">
        <Avatar className="size-20 ring-4 ring-card">
          <AvatarImage src={model.avatarUrl} alt="" />
          <AvatarFallback className="text-2xl font-semibold">{model.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <p key={model.name} className="animate-fade mt-4 text-2xl font-bold tracking-tight">{model.name}</p>
        {model.industries.length > 0 ? <p data-industries className="mt-1 text-xs font-semibold uppercase tracking-wider text-brand">{model.industries.join(" · ")}</p> : null}
        <p key={model.headline} className="animate-fade mt-2 line-clamp-2 text-muted-foreground">{model.headline || "Your LinkedIn headline and topics will appear here."}</p>
        {model.hasPostData === false ? (
          <span className="mt-4 inline-flex items-center gap-1.5 rounded-lg border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <CalendarDays className="size-3.5" aria-hidden="true" /> No post data available
          </span>
        ) : null}
        <div className="mt-5 flex w-full items-center gap-3 text-xs text-muted-foreground">
          <span>Data</span>
          <span className="h-1 flex-1 overflow-hidden rounded-full bg-muted" aria-hidden="true">
            <span className="animate-fill block h-1 rounded-full bg-brand transition-[width] duration-500" style={{ width: `${model.progress}%` }} />
          </span>
          <span className="font-semibold text-foreground">{pending ? "Pending" : "Ready"}</span>
        </div>
      </div>
      <dl className="mt-5 grid grid-cols-3 divide-x border-t bg-muted/40">
        <Stat label="Followers" value={model.followers === null ? "—" : model.followers.toLocaleString("en-US")} />
        <Stat label="Est. impressions" value={model.medianViews === null || model.hasPostData === false ? "—" : model.medianViews.toLocaleString("en-US")} />
        <Stat label={model.costLabel ?? "Potential cost"} value={model.priceCents === null ? "—" : formatEuro(model.priceCents)} />
      </dl>
      {model.bundle ? (
        <div className="flex justify-center border-t bg-card py-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
            <Package className="size-3.5" aria-hidden="true" /> {model.bundle.posts}-post bundle · {formatEuro(model.bundle.totalCents)}
          </span>
        </div>
      ) : null}
      <div className="flex justify-center border-t bg-muted/40 py-3">
        <button
          type="button"
          onClick={onMore}
          className="inline-flex items-center gap-1.5 rounded-full border bg-card px-4 py-1.5 text-xs font-semibold transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
        >
          More details
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
