"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { countryFlag, countryName } from "@/lib/country-flag";
import { INDUSTRIES } from "../../constants";
import type { CountryOptionDto, MarketplaceQuery } from "../../schemas";
import { ActivityFilter } from "./ActivityFilter";
import { MultiSelectPill } from "./MultiSelectPill";
import { PriceFilter } from "./PriceFilter";
import { SearchInput } from "./SearchInput";
import { SortSelect } from "./SortSelect";
import { useMarketplaceUrl } from "./useMarketplaceUrl";

type Props = { query: MarketplaceQuery; countries: CountryOptionDto[]; count: number };

export function MarketplaceToolbar({ query, countries, count }: Props) {
  const { update, reset } = useMarketplaceUrl();
  const filtered =
    query.industry.length > 0 || query.country.length > 0 || query.min !== undefined || query.max !== undefined || Boolean(query.q) || query.activity !== "any";
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput key={query.q ?? ""} initial={query.q ?? ""} />
        <SortSelect value={query.sort} />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <MultiSelectPill
          label="Industry"
          searchPlaceholder="Search industries…"
          options={INDUSTRIES.map((i) => ({ value: i, label: i }))}
          selected={query.industry}
          onChange={(values) => update({ industry: values })}
        />
        <MultiSelectPill
          label="Country"
          searchPlaceholder="Search countries…"
          options={countries.map((c) => ({ value: c.code, label: `${countryFlag(c.code)} ${countryName(c.code)}`, hint: String(c.count) }))}
          selected={query.country}
          onChange={(values) => update({ country: values })}
        />
        <PriceFilter min={query.min} max={query.max} count={count} />
        <ActivityFilter value={query.activity} />
        {filtered ? (
          <Button type="button" variant="ghost" size="sm" onClick={reset} className="rounded-full text-muted-foreground">
            <RotateCcw className="size-3.5" aria-hidden="true" />
            Reset
          </Button>
        ) : null}
      </div>
    </div>
  );
}
