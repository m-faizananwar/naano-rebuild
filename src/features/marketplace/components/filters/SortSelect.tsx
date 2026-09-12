"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SORT_OPTIONS, type SortKey } from "../../constants";
import { useMarketplaceUrl } from "./useMarketplaceUrl";

export function SortSelect({ value }: { value: SortKey }) {
  const { update } = useMarketplaceUrl();
  const items = Object.fromEntries(SORT_OPTIONS.map((o) => [o.value, o.label]));
  return (
    <div className="flex items-center gap-2">
      <span id="sort-label" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Sort by
      </span>
      <Select value={value} items={items} onValueChange={(next) => update({ sort: next === "best" ? undefined : String(next) })}>
        <SelectTrigger aria-labelledby="sort-label" className="min-w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
