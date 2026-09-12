import { Check } from "lucide-react";
import { COPY } from "../constants";

type Props = { company: string; valueProp: string; icpTitles: string[]; industries: string[]; regions: string[] };

function firstSentence(text: string): string {
  const match = text.trim().match(/^[^.!?]+[.!?]/);
  return (match ? match[0] : text).trim();
}

// "STARTER CREATOR BRIEF — What your creators will receive ✓ Ready": the
// PRODUCT / AUDIENCE lines are derived live from the form values.
export function StarterBriefPreview({ company, valueProp, icpTitles, industries, regions }: Props) {
  const product = valueProp.trim() ? firstSentence(valueProp) : `${company} — describe the product above.`;
  const titles = icpTitles.map((t) => t.trim()).filter(Boolean);
  const audience = titles.length > 0 ? titles.join(" · ") : `Professionals in ${industries.join(", ") || "B2B"}`;
  const where = regions.length > 0 ? regions.join(", ") : "Europe";
  return (
    <section aria-labelledby="starter-brief-title" className="rounded-2xl border border-brand/30 bg-brand-soft/40 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 id="starter-brief-title" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {COPY.profile.briefLabel}
          </h2>
          <p className="text-sm font-medium">{COPY.profile.briefHint}</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-background px-2.5 py-1 text-xs font-semibold text-brand ring-1 ring-brand/30">
          <Check className="size-3.5" aria-hidden="true" />
          {COPY.profile.briefReady}
        </span>
      </div>
      <dl className="mt-4 grid gap-3 text-sm">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Product</dt>
          <dd className="mt-0.5">{product}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Audience</dt>
          <dd className="mt-0.5">
            {audience} — {industries.join(", ") || "B2B"} in {where}
          </dd>
        </div>
      </dl>
      <p className="mt-4 text-xs text-muted-foreground">{COPY.profile.briefNote}</p>
      <p className="mt-1 text-xs text-muted-foreground">{COPY.profile.briefFootnote}</p>
    </section>
  );
}
