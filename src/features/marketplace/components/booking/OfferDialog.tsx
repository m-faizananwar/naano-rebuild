"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatEuro } from "@/lib/format-euro";
import { useMarketplace } from "../useMarketplace";
import { OfferForm } from "./OfferForm";

// "Make an offer": the negotiate dialog, verbatim from the inventory.
export function OfferDialog() {
  const { booking, closeBooking, setBookingStep } = useMarketplace();
  const open = booking?.step === "offer";
  const creator = booking?.creator;
  return (
    <Dialog open={open} onOpenChange={(next) => (next ? undefined : closeBooking())}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-lg">
        {creator ? (
          <>
            <DialogHeader className="flex-row items-center gap-3 text-left">
              <Avatar className="size-12 rounded-full border">
                <AvatarImage src={creator.avatarUrl} alt="" />
                <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <DialogTitle>Make an offer</DialogTitle>
                <DialogDescription className="truncate">
                  {creator.name} · Single post — Current price: {formatEuro(creator.priceCents)} per post
                </DialogDescription>
              </div>
            </DialogHeader>
            <OfferForm key={creator.id} creator={creator} />
            <Button type="button" variant="ghost" onClick={() => setBookingStep("selection")} className="justify-self-start">
              Back
            </Button>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
