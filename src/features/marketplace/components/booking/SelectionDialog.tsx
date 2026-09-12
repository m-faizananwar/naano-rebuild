"use client";

import { ArrowLeftRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatEuro } from "@/lib/format-euro";
import { MIN_TOPUP_CENTS, TOPUP_STEP_CENTS } from "../../constants";
import type { CreatorDto } from "../../schemas";
import { bookCreator } from "../../server/actions";
import { useMarketplace } from "../useMarketplace";
import { BookingSent } from "./BookingSent";
import { InsufficientFundsCta } from "./InsufficientFundsCta";

type Option = "single" | "bundle";

function topupFor(shortfallCents: number) {
  return Math.max(MIN_TOPUP_CENTS, Math.ceil(shortfallCents / TOPUP_STEP_CENTS) * TOPUP_STEP_CENTS);
}

function RateRow({ creator, option, onBook, onNegotiate, pending, walletCents }: {
  creator: CreatorDto; option: Option; onBook: () => void; onNegotiate?: () => void; pending: boolean; walletCents: number;
}) {
  const feeCents = option === "single" ? creator.priceCents : (creator.bundle?.totalCents ?? 0);
  const short = walletCents < feeCents;
  return (
    <div className="rounded-xl border p-4">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Creator rate</p>
      <div className="mt-1 flex items-baseline justify-between gap-2">
        <p className="font-semibold">{option === "single" ? "Single post" : `Bundle · ${creator.bundle?.posts} posts`}</p>
        <p className="text-lg font-semibold tabular-nums">{formatEuro(feeCents)}</p>
      </div>
      <p className="text-xs text-muted-foreground">
        {option === "single" ? "Standard rate · Book this option at the listed price, or propose a lower price." : "Bundle rate · One invitation for the whole series."}
      </p>
      {short ? (
        <div className="mt-3">
          <InsufficientFundsCta topupCents={topupFor(feeCents - walletCents)} walletCents={walletCents} feeCents={feeCents} />
        </div>
      ) : (
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:justify-end">
          {onNegotiate ? (
            <Button type="button" variant="outline" onClick={onNegotiate} disabled={pending}>
              <ArrowLeftRight className="size-4" aria-hidden="true" />
              Negotiate
            </Button>
          ) : null}
          <Button type="button" onClick={onBook} disabled={pending} className="bg-brand text-brand-foreground hover:bg-brand/90">
            {pending ? "Booking…" : `Book · ${formatEuro(feeCents)}`}
          </Button>
        </div>
      )}
    </div>
  );
}

// "Your selection": book at the listed price or open "Make an offer".
export function SelectionDialog() {
  const { booking, closeBooking, setBookingStep, markInvited, ctx } = useMarketplace();
  const [pending, setPending] = useState<Option | null>(null);
  const [error, setError] = useState<string | null>(null);
  const open = booking !== null && booking.step !== "offer";
  const creator = booking?.creator;

  async function book(option: Option) {
    if (!creator || !ctx.selectedCampaign) return;
    setPending(option);
    setError(null);
    const result = await bookCreator({ campaignId: ctx.selectedCampaign.id, creatorId: creator.id, option });
    setPending(null);
    if (!result.ok) {
      setError(result.error);
      toast.error(result.error);
      return;
    }
    markInvited(creator.id, result.data.status);
    setBookingStep("sent", result.data.acceptBy);
    toast.success(`Invitation sent to ${creator.name}`);
  }

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? undefined : closeBooking())}>
      <DialogContent className="sm:max-w-md">
        {creator && booking?.step === "sent" ? <BookingSent creatorName={creator.name} onClose={closeBooking} /> : null}
        {creator && booking?.step === "selection" ? (
          <>
            <DialogHeader>
              <DialogTitle>Your selection</DialogTitle>
              <DialogDescription>
                {creator.name} · {ctx.selectedCampaign?.name ?? "No campaign selected"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3">
              <RateRow creator={creator} option="single" walletCents={ctx.walletCents} pending={pending === "single"} onBook={() => book("single")} onNegotiate={() => setBookingStep("offer")} />
              {creator.bundle ? (
                <RateRow creator={creator} option="bundle" walletCents={ctx.walletCents} pending={pending === "bundle"} onBook={() => book("bundle")} />
              ) : null}
            </div>
            {error ? (
              <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            ) : null}
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={closeBooking}>
                Back
              </Button>
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
