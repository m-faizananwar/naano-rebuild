"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { addDays, format } from "date-fns";
import { FileText } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatEuro } from "@/lib/format-euro";
import { toCents } from "@/lib/money";
import { ACCEPT_WINDOW_HOURS, DEFAULT_DISCOUNT_PRESET, DEFAULT_POST_BY_DAYS, MIN_TOPUP_CENTS, TOPUP_STEP_CENTS } from "../../constants";
import { type CreatorDto, type OfferFormValues, offerFormSchema } from "../../schemas";
import { sendOffer } from "../../server/actions";
import { useMarketplace } from "../useMarketplace";
import { DiscountPresets, discountedCents } from "./DiscountPresets";
import { InsufficientFundsCta } from "./InsufficientFundsCta";

const PERCENT = 100;
const CENTS = 100;

function discountOf(priceCents: number, offerCents: number) {
  return Math.max(0, Math.round(((priceCents - offerCents) / priceCents) * PERCENT));
}

function topupFor(shortfallCents: number) {
  return Math.max(MIN_TOPUP_CENTS, Math.ceil(shortfallCents / TOPUP_STEP_CENTS) * TOPUP_STEP_CENTS);
}

export function OfferForm({ creator }: { creator: CreatorDto }) {
  const { ctx, setBookingStep, markInvited } = useMarketplace();
  const [serverError, setServerError] = useState<string | null>(null);
  const campaigns = ctx.campaigns.filter((c) => c.status !== "completed");
  const form = useForm<OfferFormValues>({
    resolver: zodResolver(offerFormSchema),
    defaultValues: {
      preset: "20",
      offerEuros: discountedCents(creator.priceCents, DEFAULT_DISCOUNT_PRESET) / CENTS,
      postBy: format(addDays(new Date(), DEFAULT_POST_BY_DAYS), "yyyy-MM-dd"),
      campaignId: ctx.selectedCampaign?.id ?? campaigns[0]?.id ?? "",
      approveBeforePublish: true,
    },
  });
  const { errors, isSubmitting } = form.formState;
  const offerEuros = Number(form.watch("offerEuros")) || 0;
  const offerCents = toCents(offerEuros);
  const discount = discountOf(creator.priceCents, offerCents);
  const short = ctx.walletCents < offerCents;

  function choosePreset(preset: string) {
    form.setValue("preset", preset as OfferFormValues["preset"]);
    if (preset !== "other") form.setValue("offerEuros", discountedCents(creator.priceCents, Number(preset)) / CENTS, { shouldValidate: true });
  }

  async function onSubmit(values: OfferFormValues) {
    setServerError(null);
    const campaignName = campaigns.find((c) => c.id === values.campaignId)?.name ?? "";
    const result = await sendOffer({
      campaignId: values.campaignId,
      creatorId: creator.id,
      offerCents: toCents(values.offerEuros),
      discountPercent: discountOf(creator.priceCents, toCents(values.offerEuros)),
      postBy: values.postBy,
      approveBeforePublish: values.approveBeforePublish,
      note: campaignName ? `Specific brief · ${campaignName}` : undefined,
    });
    if (!result.ok) {
      setServerError(result.error);
      toast.error(result.error);
      return;
    }
    markInvited(creator.id, result.data.status);
    setBookingStep("sent", result.data.acceptBy);
    toast.success(`Offer sent to ${creator.name}`);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5" noValidate>
      <fieldset className="grid gap-2">
        <legend className="text-sm font-semibold">Choose a discount</legend>
        <Controller control={form.control} name="preset" render={({ field }) => <DiscountPresets priceCents={creator.priceCents} value={field.value} onChange={choosePreset} />} />
        <div className="grid gap-1.5">
          <Label htmlFor="offer-euros">Your offer €</Label>
          <Input id="offer-euros" type="number" step="0.1" min={0} inputMode="decimal" {...form.register("offerEuros", { valueAsNumber: true, onChange: () => form.setValue("preset", "other") })} />
          <p className="text-xs text-muted-foreground">The creator will see a {discount}% discount request.</p>
          {errors.offerEuros ? <p role="alert" className="text-sm text-destructive">{errors.offerEuros.message}</p> : null}
        </div>
      </fieldset>

      <div className="grid gap-1.5">
        <div className="flex items-baseline justify-between">
          <Label htmlFor="post-by">Post by</Label>
          <span className="text-xs text-muted-foreground">{DEFAULT_POST_BY_DAYS} days from now</span>
        </div>
        <Input id="post-by" type="date" {...form.register("postBy")} />
        <p className="text-xs text-muted-foreground">Latest date the creator must publish the post. Defaults to {DEFAULT_POST_BY_DAYS} days.</p>
        {errors.postBy ? <p role="alert" className="text-sm text-destructive">{errors.postBy.message}</p> : null}
      </div>

      <fieldset className="grid gap-2">
        <legend className="text-sm font-semibold">How should the creator work?</legend>
        <div className="rounded-xl border-2 border-brand bg-brand/5 p-3">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <FileText className="size-4 text-brand" aria-hidden="true" />
            Specific brief
          </p>
          <p className="text-xs text-muted-foreground">Use detailed instructions from one of your campaign briefs.</p>
          <div className="mt-3 grid gap-1.5">
            <Label id="offer-campaign-label" htmlFor="offer-campaign">Campaign</Label>
            <Controller
              control={form.control}
              name="campaignId"
              render={({ field }) => (
                <Select value={field.value} items={Object.fromEntries(campaigns.map((c) => [c.id, c.name]))} onValueChange={(v) => field.onChange(String(v ?? ""))}>
                  <SelectTrigger id="offer-campaign" aria-labelledby="offer-campaign-label" className="w-full">
                    <SelectValue placeholder="Pick a campaign that has a brief." />
                  </SelectTrigger>
                  <SelectContent>
                    {campaigns.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <p className="text-xs text-muted-foreground">Pick a campaign that has a brief.</p>
            {errors.campaignId ? <p role="alert" className="text-sm text-destructive">{errors.campaignId.message}</p> : null}
          </div>
        </div>
      </fieldset>

      <Controller
        control={form.control}
        name="approveBeforePublish"
        render={({ field }) => (
          <Label htmlFor="approve-first" className="flex items-center gap-2 text-sm font-normal">
            <Checkbox id="approve-first" checked={field.value} onCheckedChange={(checked) => field.onChange(checked)} />
            I want to approve the content before it is published.
          </Label>
        )}
      />

      <p className="text-xs text-muted-foreground">The creator receives the offer immediately and can accept or decline it within {ACCEPT_WINDOW_HOURS} hours.</p>

      {serverError ? (
        <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {serverError}
        </p>
      ) : null}

      {short ? (
        <InsufficientFundsCta topupCents={topupFor(offerCents - ctx.walletCents)} walletCents={ctx.walletCents} feeCents={offerCents} />
      ) : (
        <Button type="submit" size="lg" disabled={isSubmitting} className="bg-brand text-brand-foreground hover:bg-brand/90">
          {isSubmitting ? "Sending…" : `Send offer · ${formatEuro(offerCents)}`}
        </Button>
      )}
    </form>
  );
}
