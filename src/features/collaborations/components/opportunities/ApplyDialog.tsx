"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/dates";
import { formatCents } from "@/lib/money";
import type { OpportunityDto } from "../../schemas";
import { BrandMark } from "../BrandMark";

type Props = { opportunity: OpportunityDto | null; onOpenChange: (open: boolean) => void; onConfirm: (o: OpportunityDto) => void };

// What the creator commits to before the application goes out.
export function ApplyDialog({ opportunity: o, onOpenChange, onConfirm }: Props) {
  return (
    <Dialog open={o !== null} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {o ? (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <BrandMark initial={o.brandInitial} name={o.brandCompany} />
                <div>
                  <DialogTitle>Apply to {o.brandCompany}</DialogTitle>
                  <DialogDescription>{o.campaignName}</DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <dl className="divide-y rounded-xl border text-sm">
              <div className="flex items-center justify-between px-4 py-2.5">
                <dt className="text-muted-foreground">Your net price per post</dt>
                <dd className="font-semibold">{formatCents(o.listPriceCents, "EUR")}</dd>
              </div>
              <div className="flex items-center justify-between px-4 py-2.5">
                <dt className="text-muted-foreground">Post deadline</dt>
                <dd className="font-semibold">{formatDate(o.postDeadline, "Open")}</dd>
              </div>
              <div className="flex items-center justify-between px-4 py-2.5">
                <dt className="text-muted-foreground">Channel</dt>
                <dd className="font-semibold">LinkedIn · 1 post</dd>
              </div>
            </dl>
            <p className="text-sm text-muted-foreground">
              The brand accepts, then the booking is created on your terms: the fee is held from their wallet, your tracked link
              is generated and the thread opens. You write the post in your own voice, with the brief as the guardrail.
            </p>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="button" className="bg-brand text-brand-foreground hover:bg-brand/90" onClick={() => onConfirm(o)}>
                Send my application
              </Button>
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
