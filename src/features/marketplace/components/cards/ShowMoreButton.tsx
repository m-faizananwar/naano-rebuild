"use client";

import { Button } from "@/components/ui/button";
import { useMarketplaceUrl } from "../filters/useMarketplaceUrl";

type Props = { shown: number; total: number; page: number; hasMore: boolean };

// naano paginates by appending: "Show more creators (24 / 300)".
export function ShowMoreButton({ shown, total, page, hasMore }: Props) {
  const { update } = useMarketplaceUrl();
  if (!hasMore) {
    return <p className="mt-6 text-center text-sm text-muted-foreground">Showing all {total} creators</p>;
  }
  return (
    <div className="mt-6 flex justify-center">
      <Button type="button" variant="outline" size="lg" onClick={() => update({ page: page + 1 }, { keepPage: true })}>
        Show more creators ({shown} / {total})
      </Button>
    </div>
  );
}
