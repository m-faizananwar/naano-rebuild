"use client";

import { Info } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatCompact, formatEuro, formatEuroWhole } from "@/lib/format-euro";
import type { CreatorDto } from "../../schemas";

export function PricingPopover({ creator }: { creator: CreatorDto }) {
  return (
    <Popover>
      <PopoverTrigger
        render={<button type="button" className="inline-flex items-center gap-1 text-xs font-medium text-brand hover:underline focus-visible:outline-2 focus-visible:outline-ring" />}
      >
        <Info className="size-3.5" aria-hidden="true" />
        How pricing is calculated
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 text-sm">
        <p className="font-semibold">Typical reach × CPM</p>
        <p className="text-muted-foreground">
          The creator sets the post price. Naano divides it by their median views to show a CPM, so you can compare creators of different sizes on
          the same basis.
        </p>
        <p className="rounded-lg bg-muted px-3 py-2 tabular-nums">
          {formatCompact(creator.medianViews)} views × {creator.cpmCents === null ? "—" : formatEuroWhole(creator.cpmCents)} / 1 000 ≈ {formatEuro(creator.priceCents)}
        </p>
      </PopoverContent>
    </Popover>
  );
}
