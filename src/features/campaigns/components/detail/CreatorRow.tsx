import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatCents } from "@/lib/money";
import type { CreatorPickDto } from "../../schemas";

type Props = { creator: CreatorPickDto; action?: React.ReactNode; leading?: React.ReactNode };

// One creator line: avatar · name · industries · fit % · price. Shared by the
// shortlist tab and the stepper's "Pick creators" step.
export function CreatorRow({ creator, action, leading }: Props) {
  return (
    <div className="flex items-center gap-3 py-3">
      {leading}
      <Avatar className="size-9">
        <AvatarImage src={creator.avatarUrl} alt="" />
        <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{creator.name}</p>
        <p className="truncate text-xs text-muted-foreground">
          {creator.industries.join(" · ") || "No industries yet"} · {creator.country}
        </p>
        <p className="mt-0.5 hidden truncate text-xs text-muted-foreground sm:block">{creator.reason}</p>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-sm font-semibold tabular-nums">
          <span className="text-brand">{creator.fit}%</span> fit
        </p>
        <p className="text-xs text-muted-foreground tabular-nums">{formatCents(creator.priceCents, "EUR")} / post</p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
