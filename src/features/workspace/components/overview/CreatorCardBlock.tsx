import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import type { PublicCard } from "../../server/card-queries";
import { DealLinkDialog } from "../card/DealLinkDialog";
import { WorkspaceCard } from "../card/WorkspaceCard";
import { CopyLinkButton } from "../CopyLinkButton";

// "Your creator card" block from the reference overview: title + three stacked
// buttons on the right, the card underneath.
export function CreatorCardBlock({ card, cardLink }: { card: PublicCard; cardLink: string }) {
  return (
    <section className="rounded-2xl border bg-background p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-semibold">Your creator card</h2>
          <p className="text-sm text-muted-foreground">This is how brands discover your positioning and collaboration offer.</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <Link href={`/c/${card.handle}`} target="_blank" className={buttonVariants({ variant: "outline", size: "sm" })}>
            <ExternalLink aria-hidden="true" /> Open card
          </Link>
          <CopyLinkButton value={cardLink} label="Copy card link" variant="outline" size="sm" />
          <DealLinkDialog url={cardLink} handle={card.handle} label="Share my card" primary size="sm" />
        </div>
      </div>
      <div className="mt-5 flex justify-center">
        <WorkspaceCard card={card} />
      </div>
    </section>
  );
}
