import type React from "react";
import { ChevronDown } from "lucide-react";
import { countryFlag, countryName } from "@/lib/country-flag";
import type { CreatorDto } from "../../schemas";

// naano's "Professional profile" accordion at the bottom of the overview.
export function ProfessionalProfile({ creator }: { creator: CreatorDto }) {
  const memberSince = new Date(creator.memberSince).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  const rows: Array<[string, React.ReactNode]> = [
    ["Headline", creator.headline || "—"],
    ["About", creator.bio || "—"],
    ["Country", `${countryFlag(creator.country)} ${countryName(creator.country)}`],
    [
      "Networks",
      <span key="networks" className="flex flex-wrap gap-2">
        {creator.linkedinUrl ? (
          <a href={creator.linkedinUrl} target="_blank" rel="noreferrer" className="font-medium text-brand hover:underline">LinkedIn</a>
        ) : (
          <span>LinkedIn</span>
        )}
        {creator.xHandle ? (
          <a href={`https://x.com/${creator.xHandle.replace(/^@/, "")}`} target="_blank" rel="noreferrer" className="font-medium text-brand hover:underline">
            X · @{creator.xHandle.replace(/^@/, "")}
          </a>
        ) : null}
      </span>,
    ],
    ["Member since", memberSince],
  ];
  return (
    <details className="accordion group rounded-xl border">
      <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-semibold marker:content-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 [&::-webkit-details-marker]:hidden">
        Professional profile
        <ChevronDown className="size-4 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden="true" />
      </summary>
      <dl className="grid gap-3 border-t px-4 py-3 text-sm [--accordion-height:16rem]">
        {rows.map(([label, value]) => (
          <div key={label} className="grid gap-0.5 sm:grid-cols-[8rem_1fr]">
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</dt>
            <dd className="text-foreground">{value}</dd>
          </div>
        ))}
      </dl>
    </details>
  );
}
