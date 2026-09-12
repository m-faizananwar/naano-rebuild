import { formatCents } from "@/lib/money";
import type { AffiliateSummary } from "../server/affiliate-queries";

export function IntroducedBrands({ brands }: { brands: AffiliateSummary["brands"] }) {
  if (brands.length === 0) return null;
  return (
    <section className="rounded-2xl border bg-background p-5">
      <h2 className="font-semibold">Brands you introduced</h2>
      <ul className="mt-3 divide-y text-sm">
        {brands.map((b) => (
          <li key={b.company + b.joinedAt} className="flex flex-wrap items-center justify-between gap-2 py-2">
            <span>
              <span className="font-medium">{b.company}</span> <span className="text-muted-foreground">· joined {b.joinedAt.slice(0, "YYYY-MM-DD".length)}</span>
            </span>
            <span className="text-muted-foreground">
              {b.paidCollaborations} paid · {formatCents(b.rewardCents, "EUR")} reward
              {b.windowEndsAt ? ` · window ends ${b.windowEndsAt.slice(0, "YYYY-MM-DD".length)}` : " · window starts at their first paid campaign"}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
