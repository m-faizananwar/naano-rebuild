"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export type UrlPatch = Record<string, string | string[] | number | undefined | null>;

// Every filter, sort, search, tab, campaign and page lives in the URL so the
// server renders the same list on reload and links are shareable.
export function useMarketplaceUrl() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const update = useCallback(
    (patch: UrlPatch, options: { keepPage?: boolean } = {}) => {
      const next = new URLSearchParams(params.toString());
      for (const [key, value] of Object.entries(patch)) {
        const flat = Array.isArray(value) ? value.join(",") : value;
        if (flat === undefined || flat === null || flat === "" || flat === 0) next.delete(key);
        else next.set(key, String(flat));
      }
      if (!options.keepPage && !("page" in patch)) next.delete("page");
      const query = next.toString();
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [params, pathname, router],
  );

  const reset = useCallback(() => {
    const campaign = params.get("campaign");
    router.push(campaign ? `${pathname}?campaign=${campaign}` : pathname, { scroll: false });
  }, [params, pathname, router]);

  return { params, update, reset };
}
