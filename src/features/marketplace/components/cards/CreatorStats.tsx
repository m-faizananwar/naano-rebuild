import { formatCompact, formatEuro, formatEuroWhole } from "@/lib/format-euro";
import type { CreatorDto } from "../../schemas";

type Props = { creator: CreatorDto; columns?: 2 | 4 };

// FOLLOWERS / MEDIAN VIEWS / CPM / POST COST, the four numbers on every card.
export function CreatorStats({ creator, columns = 2 }: Props) {
  const stats = [
    { label: "Followers", value: formatCompact(creator.followers) },
    { label: "Median views", value: formatCompact(creator.medianViews) },
    { label: "CPM", value: creator.cpmCents === null ? "—" : formatEuroWhole(creator.cpmCents) },
    { label: "Post cost", value: formatEuro(creator.priceCents) },
  ];
  return (
    <dl className={columns === 4 ? "grid grid-cols-2 gap-3 sm:grid-cols-4" : "grid grid-cols-2 gap-3"}>
      {stats.map((s) => (
        <div key={s.label} className="rounded-lg bg-muted/60 px-3 py-2">
          <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{s.label}</dt>
          <dd className="text-sm font-semibold tabular-nums">{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}
