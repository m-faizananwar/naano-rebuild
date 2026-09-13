"use client";

import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMotionDialog } from "@/components/motion/useMotionDialog";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { primaryCta } from "@/lib/brief-markdown";
import type { BriefDto } from "../../schemas";
import { BrandMark } from "../BrandMark";
import { BriefAngleCard } from "./BriefAngleCard";
import { BriefSection } from "./BriefSection";
import { CopyForAiButton } from "./CopyForAiButton";
import { CopyMarkdownButton } from "./CopyMarkdownButton";

type Props = { brief: BriefDto; open: boolean; onOpenChange: (open: boolean) => void };

function List({ items, empty }: { items: string[]; empty: string }) {
  if (items.length === 0) return <p className="text-muted-foreground">{empty}</p>;
  return (
    <ul className="list-disc space-y-1 pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function website(url: string | null) {
  return url ? url.replace(/^https?:\/\//, "") : null;
}

// Right-side panel with the whole brief, opened from an opportunity card or a
// collaboration. Same sections, same order as naano's drawer.
export function BriefDrawer({ brief, open, onOpenChange }: Props) {
  const { attachContent, handleOpenChange: requestOpenChange } = useMotionDialog(onOpenChange, { axis: "x", distance: 24 });
  return (
    <Sheet open={open} onOpenChange={requestOpenChange}>
      <SheetContent ref={attachContent} side="right" showCloseButton={false} className="w-full gap-0 overflow-y-auto bg-background p-0 transition-none data-[side=right]:w-full data-[side=right]:sm:max-w-2xl">
        <header className="sticky top-0 z-10 flex items-center gap-4 border-b bg-background px-6 py-4">
          <BrandMark initial={brief.brandInitial} name={brief.brandCompany} size="lg" />
          <div className="min-w-0 flex-1">
            <SheetTitle className="truncate text-lg font-semibold">{brief.campaignName}</SheetTitle>
            <SheetDescription className="truncate">
              {brief.brandCompany}
              {brief.brandWebsite ? ` · ${website(brief.brandWebsite)}` : ""}
            </SheetDescription>
          </div>
          <div className="hidden sm:block">
            <CopyMarkdownButton brief={brief} />
          </div>
          <SheetClose render={<Button type="button" variant="ghost" size="icon-sm" />}>
            <XIcon aria-hidden="true" />
            <span className="sr-only">Close</span>
          </SheetClose>
        </header>

        <div className="min-h-full space-y-4 bg-muted/40 p-6">
          <div className="sm:hidden">
            <CopyMarkdownButton brief={brief} />
          </div>
          <div className="flex flex-col gap-4 rounded-2xl border border-brand/20 bg-brand/5 p-5 sm:flex-row sm:items-center">
            <div className="flex-1">
              <h3 className="font-semibold">Create my post with AI</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Copy a clean prompt with the brief, angles and examples. Paste it into your AI; add 2 or 3 previous posts if it does
                not know your style yet.
              </p>
            </div>
            <CopyForAiButton brief={brief} />
          </div>

          <BriefSection title="Campaign objectives">
            <p className="whitespace-pre-line">{brief.whatToTell}</p>
            <p>
              <span className="font-medium">Primary CTA:</span> {primaryCta(brief)}
            </p>
            <p>
              <span className="font-medium">Secondary win:</span> comments and DMs from the right people.
            </p>
          </BriefSection>

          <BriefSection title="Target audience">
            <p>
              <span className="font-medium">Brand:</span> {brief.brandCompany}
              {brief.campaignDescription ? ` — ${brief.campaignDescription}` : ""}
            </p>
            {brief.valueProp ? (
              <p>
                <span className="font-medium">Why we exist:</span> {brief.valueProp}
              </p>
            ) : null}
            <p className="font-medium">ICP (who the creator is talking to):</p>
            <List items={brief.icpTitles} empty="The brand has not described its buyers yet." />
            <p>
              <span className="font-medium">Industries:</span> {brief.targetIndustries.join(" · ") || "any"} ·{" "}
              <span className="font-medium">Regions:</span> {brief.targetGeos.join(" · ") || "any"}
            </p>
            <p className="font-medium">Proof points to lean on:</p>
            <List items={brief.links} empty="No links yet — stick to the confirmed company profile." />
          </BriefSection>

          <BriefSection title="Call to action">
            <p className="font-medium">Do:</p>
            <List items={brief.do} empty="—" />
            <p className="font-medium">Don&apos;t:</p>
            <List items={brief.avoid} empty="—" />
            <p>
              <span className="font-medium">Tone:</span> {brief.tone}
            </p>
          </BriefSection>

          <BriefSection title={`Content angles · ${brief.angleCount}`}>
            {brief.angles.length === 0 ? <p className="text-muted-foreground">No angles yet — pick your own.</p> : null}
            {brief.angles.map((angle, i) => (
              <BriefAngleCard key={`${i}-${angle.angle}`} index={i + 1} angle={angle} />
            ))}
          </BriefSection>
        </div>
      </SheetContent>
    </Sheet>
  );
}
