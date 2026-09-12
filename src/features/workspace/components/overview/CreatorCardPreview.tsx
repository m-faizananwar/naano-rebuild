import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatCents } from "@/lib/money";
import type { CreatorOverview } from "../../server/overview-queries";

function flag(code: string) {
  const base = 127_397;
  return code.length === 2 ? String.fromCodePoint(...[...code.toUpperCase()].map((c) => base + c.charCodeAt(0))) : "";
}

// The marketplace card, as brands see it.
export function CreatorCardPreview({ card }: { card: CreatorOverview["card"] }) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-background">
      <div className="flex items-center justify-between bg-brand px-4 py-3 text-brand-foreground">
        <span className="rounded bg-brand-foreground/15 px-2 py-0.5 text-xs font-semibold">in · LinkedIn</span>
        <span className="text-sm font-bold">naano</span>
        <span aria-label={card.country}>{flag(card.country)}</span>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="size-12">
            <AvatarImage src={card.avatarUrl} alt="" />
            <AvatarFallback>{card.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-semibold">{card.name}</p>
            <p className="truncate text-xs text-muted-foreground">{card.industries.join(" · ") || "Industries not set"}</p>
          </div>
        </div>
        <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{card.headline || "Add a headline in Settings."}</p>
        <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-muted p-2">
            <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">Followers</dt>
            <dd className="text-sm font-semibold">{card.followers.toLocaleString("en-US")}</dd>
          </div>
          <div className="rounded-lg bg-muted p-2">
            <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">Est. impressions</dt>
            <dd className="text-sm font-semibold">{card.medianViews.toLocaleString("en-US")}</dd>
          </div>
          <div className="rounded-lg bg-muted p-2">
            <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">Chosen cost</dt>
            <dd className="text-sm font-semibold">{formatCents(card.priceCents, "EUR")}</dd>
          </div>
        </dl>
        {card.bundle ? (
          <p className="mt-3 inline-block rounded-full border px-3 py-1 text-xs font-medium">
            {card.bundle.posts}-post bundle · {formatCents(card.bundle.totalCents, "EUR")}
          </p>
        ) : null}
      </div>
    </div>
  );
}
