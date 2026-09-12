import { formatCompact } from "@/lib/format-euro";
import type { CreatorDto } from "../../schemas";
import { AudienceSnapshot } from "./AudienceSnapshot";
import { ContentPerformance } from "./ContentPerformance";
import { FitBreakdown } from "./FitBreakdown";

type Props = { creator: CreatorDto; campaignName: string | null };

function topAudienceChip(creator: CreatorDto) {
  const [top] = Object.entries(creator.audienceJobTitles).sort((a, b) => b[1] - a[1]);
  return top ? `${Math.round(top[1])}% in observed audience · ${top[0]}` : null;
}

export function ProfileOverview({ creator, campaignName }: Props) {
  const chips = [topAudienceChip(creator), `${formatCompact(creator.medianViews)} typical reach`].filter(Boolean) as string[];
  return (
    <div className="grid gap-4">
      <section>
        <h3 className="font-semibold">Creator overview</h3>
        <p className="text-sm text-muted-foreground">Review this creator&apos;s audience and recent content before booking.</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {chips.map((chip) => (
            <li key={chip} className="rounded-full border bg-background px-3 py-1 text-xs font-medium">
              {chip}
            </li>
          ))}
        </ul>
        {creator.headline ? <p className="mt-3 text-sm">{creator.headline}</p> : null}
      </section>
      <AudienceSnapshot creator={creator} />
      <ContentPerformance creator={creator} />
      <FitBreakdown creator={creator} campaignName={campaignName} />
    </div>
  );
}
