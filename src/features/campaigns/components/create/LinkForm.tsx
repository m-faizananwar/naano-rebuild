"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LINK_NOTE } from "../../constants";
import { type CreateFromLinkInput, createFromLinkSchema } from "../../schemas";
import { createCampaignFromLink } from "../../server/actions";

export function LinkForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<CreateFromLinkInput>({ resolver: zodResolver(createFromLinkSchema), defaultValues: { url: "" } });
  const { errors, isSubmitting } = form.formState;

  async function onSubmit(values: CreateFromLinkInput) {
    setServerError(null);
    const result = await createCampaignFromLink(values);
    if (!result.ok) {
      setServerError(result.error);
      return;
    }
    toast.success("Brief recovered from your workspace profile");
    router.push(`/brand/campaigns/${result.data.campaignId}/launch?generated=link`);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="max-w-xl rounded-2xl border bg-background p-5">
      <Label htmlFor="brief-url" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Brief link (Notion, Docs, PDF…)
      </Label>
      <Input id="brief-url" type="url" placeholder="https://" autoComplete="off" className="mt-1.5" {...form.register("url")} />
      {errors.url ? (
        <p role="alert" className="mt-1.5 text-sm text-destructive">
          {errors.url.message}
        </p>
      ) : null}
      <p className="mt-3 text-sm text-muted-foreground">{LINK_NOTE}. You can edit everything before launch.</p>
      {serverError ? (
        <p role="alert" className="mt-3 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {serverError}
        </p>
      ) : null}
      <Button type="submit" disabled={isSubmitting} className="mt-4 bg-brand text-brand-foreground hover:bg-brand/90">
        {isSubmitting ? "Recovering the brief…" : "Recover the brief"}
      </Button>
    </form>
  );
}
