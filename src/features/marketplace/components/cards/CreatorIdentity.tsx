import { countryFlag, countryName } from "@/lib/country-flag";
import type { CreatorDto } from "../../schemas";
import { LinkedInBadge } from "./LinkedInBadge";

type Props = { creator: CreatorDto; badge?: boolean; suffix?: string };

// Name line + "industries · flag" line, shared by cards, result rows and the modal.
export function CreatorIdentity({ creator, badge = false, suffix }: Props) {
  return (
    <div className="min-w-0">
      <p className="flex items-center gap-1.5 truncate font-semibold">
        <span className="truncate">{creator.name}</span>
        {badge ? <LinkedInBadge className="size-4 text-[9px]" /> : null}
      </p>
      <p className="truncate text-xs text-muted-foreground">
        {creator.industries.join(" · ")}
        {suffix ? ` · ${suffix}` : null}
        <span className="ml-1.5" title={countryName(creator.country)} aria-label={countryName(creator.country)}>
          {countryFlag(creator.country)}
        </span>
      </p>
    </div>
  );
}
