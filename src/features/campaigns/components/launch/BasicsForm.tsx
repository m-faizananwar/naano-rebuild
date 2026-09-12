"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toDateInputValue } from "@/lib/dates";
import { type BasicsInput, basicsSchema, type CampaignDto } from "../../schemas";
import { updateCampaignBasics } from "../../server/actions";

type Props = { campaign: CampaignDto; nextHref: string; cancelHref: string };

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </label>
      {children}
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function BasicsForm({ campaign, nextHref, cancelHref }: Props) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<BasicsInput>({
    resolver: zodResolver(basicsSchema),
    defaultValues: {
      campaignId: campaign.id,
      name: campaign.name,
      description: campaign.description,
      postDeadline: toDateInputValue(campaign.postDeadline),
      // The fee is typed in euros and stored in cents: the input owns the
      // default and setValueAs converts on read.
    },
  });
  const { errors, isSubmitting } = form.formState;

  async function onSubmit(values: BasicsInput) {
    setServerError(null);
    const result = await updateCampaignBasics(values);
    if (!result.ok) {
      setServerError(result.error);
      return;
    }
    router.push(nextHref);
    router.refresh();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="grid gap-5 rounded-2xl border bg-background p-5">
      <Field id="name" label="Campaign name" error={errors.name?.message}>
        <Input id="name" {...form.register("name")} />
      </Field>
      <Field id="description" label="Description" error={errors.description?.message}>
        <Textarea id="description" rows={3} {...form.register("description")} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="postDeadline" label="Post deadline" error={errors.postDeadline?.message}>
          <Input id="postDeadline" type="date" {...form.register("postDeadline")} />
        </Field>
        <Field id="defaultFee" label="Default fee per post (€)" error={errors.defaultFeeCents?.message}>
          <Input
            id="defaultFee"
            type="number"
            min={0}
            step={1}
            {...form.register("defaultFeeCents", { setValueAs: (v: string) => Math.round(Number(v || 0) * 100) })}
            defaultValue={campaign.defaultFeeCents / 100}
          />
        </Field>
      </div>
      {serverError ? (
        <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {serverError}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={isSubmitting} className="bg-brand text-brand-foreground hover:bg-brand/90">
          {isSubmitting ? "Saving…" : "Save and continue"}
        </Button>
        <Link href={cancelHref} className={buttonVariants({ variant: "ghost" })}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
