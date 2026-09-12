"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useMarketplaceUrl } from "./useMarketplaceUrl";

const DEBOUNCE_MS = 350;

export function SearchInput({ initial }: { initial: string }) {
  const { update } = useMarketplaceUrl();
  const [value, setValue] = useState(initial);

  // The parent keys this input on the URL's q, so an external change remounts it.
  useEffect(() => {
    if (value === initial) return;
    const timer = setTimeout(() => update({ q: value.trim() }), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [value, initial, update]);

  return (
    <div className="relative w-full sm:max-w-xs">
      <label htmlFor="creator-search" className="sr-only">
        Search for a creator
      </label>
      <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
      <Input
        id="creator-search"
        type="search"
        placeholder="Search for a creator…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="pl-8"
      />
    </div>
  );
}
