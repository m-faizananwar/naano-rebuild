import { Sparkles } from "lucide-react";
import { AI_NOTE, LINK_NOTE, TEMPLATE_NOTE } from "../../constants";

const COPY = { ai: AI_NOTE, template: TEMPLATE_NOTE, link: LINK_NOTE } as const;
export type GeneratedWith = keyof typeof COPY;

export function isGeneratedWith(value: string | undefined): value is GeneratedWith {
  return value === "ai" || value === "template" || value === "link";
}

export function GeneratedWithBanner({ generatedWith }: { generatedWith: GeneratedWith }) {
  return (
    <p className="flex items-start gap-2 rounded-xl border border-brand/30 bg-brand/5 px-4 py-3 text-sm">
      <Sparkles className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
      <span>{COPY[generatedWith]}. Everything below is editable before launch.</span>
    </p>
  );
}
