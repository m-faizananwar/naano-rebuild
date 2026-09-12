"use client";

import { ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatCompact, formatEuro } from "@/lib/format-euro";
import type { CreatorDto } from "../../schemas";
import { BookButton } from "../cards/BookButton";
import { CreatorIdentity } from "../cards/CreatorIdentity";
import { ShortlistButton } from "../cards/ShortlistButton";
import { useMarketplace } from "../useMarketplace";

// rank · avatar · name · LinkedIn badge · industries · flag · MEDIAN VIEWS · CPM · POST COST · Book · bookmark · →
export function MatchingResultRow({ creator, rank }: { creator: CreatorDto; rank: number }) {
  const { openProfile } = useMarketplace();
  const stats = [
    { label: "Median views", value: formatCompact(creator.medianViews) },
    { label: "CPM", value: creator.cpmCents === null ? "—" : formatEuro(creator.cpmCents) },
    { label: "Post cost", value: formatEuro(creator.priceCents) },
  ];
  return (
    <li className="grid gap-3 rounded-xl border bg-background p-3 md:grid-cols-[2rem_1fr_auto_auto] md:items-center">
      <span className="text-sm font-semibold tabular-nums text-muted-foreground">{rank}</span>
      <div className="flex min-w-0 items-center gap-3">
        <Avatar className="size-10 rounded-full border">
          <AvatarImage src={creator.avatarUrl} alt="" />
          <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <CreatorIdentity creator={creator} badge suffix={`${creator.fit.score}% fit`} />
      </div>
      <dl className="grid grid-cols-3 gap-3 md:gap-6">
        {stats.map((s) => (
          <div key={s.label}>
            <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{s.label}</dt>
            <dd className="text-sm font-semibold tabular-nums">{s.value}</dd>
          </div>
        ))}
      </dl>
      <div className="flex items-center gap-1 md:justify-end">
        <BookButton creator={creator} />
        <ShortlistButton creator={creator} />
        <Button type="button" variant="ghost" size="icon-sm" aria-label={`Open ${creator.name}'s profile`} onClick={() => openProfile(creator)}>
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </li>
  );
}
