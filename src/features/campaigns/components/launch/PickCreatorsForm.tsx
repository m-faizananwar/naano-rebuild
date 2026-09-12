"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { formatCents } from "@/lib/money";
import { DEFAULT_SELECTED_CREATORS } from "../../constants";
import type { CreatorPickDto } from "../../schemas";
import { CreatorRow } from "../detail/CreatorRow";

type Props = { campaignId: string; creators: CreatorPickDto[]; walletCents: number; backHref: string };

// Step 3: the brand's best-fit creators, top 4 pre-selected. The selection
// travels to the review step in the URL, so nothing is written until launch.
export function PickCreatorsForm({ campaignId, creators, walletCents, backHref }: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(() => new Set(creators.slice(0, DEFAULT_SELECTED_CREATORS).map((c) => c.id)));
  const total = creators.filter((c) => selected.has(c.id)).reduce((sum, c) => sum + c.priceCents, 0);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        router.push(`/brand/campaigns/${campaignId}/launch?step=review&creators=${[...selected].join(",")}`);
      }}
      className="grid gap-4"
    >
      <div className="rounded-2xl border bg-background p-5">
        <h2 className="text-lg font-semibold">Best-fit creators for this brief</h2>
        <p className="text-sm text-muted-foreground">Ranked by audience fit, category match and engagement. Untick anyone you would rather not invite.</p>
        {creators.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">No creators match yet. Widen the target industries in the brief.</p>
        ) : (
          <ul className="mt-2 divide-y">
            {creators.map((creator) => (
              <li key={creator.id}>
                <CreatorRow
                  creator={creator}
                  leading={
                    <>
                      <input
                        id={`pick-${creator.id}`}
                        type="checkbox"
                        checked={selected.has(creator.id)}
                        onChange={() => toggle(creator.id)}
                        className="size-4 accent-brand"
                      />
                      <label htmlFor={`pick-${creator.id}`} className="sr-only">
                        Select {creator.name}
                      </label>
                    </>
                  }
                />
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {selected.size} selected · {formatCents(total, "EUR")} to fund · wallet {formatCents(walletCents, "EUR")}
        </p>
        <div className="flex gap-2">
          <Link href={backHref} className={buttonVariants({ variant: "ghost" })}>
            Back
          </Link>
          <Button type="submit" className="bg-brand text-brand-foreground hover:bg-brand/90">
            Review & launch
          </Button>
        </div>
      </div>
    </form>
  );
}
