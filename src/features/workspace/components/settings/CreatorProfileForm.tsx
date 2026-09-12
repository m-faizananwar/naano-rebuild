"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { INDUSTRIES } from "../../constants";
import { type CreatorProfileInput, creatorProfileSchema } from "../../schemas";
import { updateCreatorProfile } from "../../server/actions";
import { ChipSelect } from "./ChipSelect";

const CENTS = 100;
const MAX_INDUSTRIES = 3;

export function CreatorProfileForm({ defaults }: { defaults: CreatorProfileInput }) {
  const router = useRouter();
  const form = useForm<CreatorProfileInput>({ resolver: zodResolver(creatorProfileSchema), defaultValues: defaults });
  const { errors, isSubmitting } = form.formState;

  async function onSubmit(values: CreatorProfileInput) {
    const result = await updateCreatorProfile(values);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Profile saved — your card updates with it");
    router.refresh();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="firstName">First name</Label>
          <Input id="firstName" {...form.register("firstName")} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="lastName">Last name</Label>
          <Input id="lastName" {...form.register("lastName")} />
        </div>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="headline">Headline</Label>
        <Input id="headline" {...form.register("headline")} />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="linkedinUrl">Public LinkedIn URL</Label>
        <Input id="linkedinUrl" placeholder="https://www.linkedin.com/in/you" {...form.register("linkedinUrl")} />
        {errors.linkedinUrl ? <p className="text-sm text-destructive">{errors.linkedinUrl.message}</p> : null}
        <p className="text-xs text-muted-foreground">Refresh profile — limited to once a week (import not part of this build).</p>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="xHandle">X handle</Label>
        <Input id="xHandle" placeholder="@you" {...form.register("xHandle")} />
        {errors.xHandle ? <p className="text-sm text-destructive">{errors.xHandle.message}</p> : null}
      </div>
      <Controller
        control={form.control}
        name="industries"
        render={({ field }) => (
          <ChipSelect label="Your industries" options={INDUSTRIES} value={field.value} onChange={field.onChange} max={MAX_INDUSTRIES} />
        )}
      />
      <Controller
        control={form.control}
        name="priceCents"
        render={({ field }) => (
          <div className="grid gap-1.5">
            <Label htmlFor="price">Net price per post (€)</Label>
            <Input
              id="price"
              type="number"
              min={20}
              max={1500}
              step="5"
              value={Math.round(field.value / CENTS)}
              onChange={(e) => field.onChange(Math.round(Number(e.target.value) * CENTS))}
            />
            {errors.priceCents ? <p className="text-sm text-destructive">{errors.priceCents.message}</p> : null}
            <p className="text-xs text-muted-foreground">This is your net price per post. You can change it at any time.</p>
          </div>
        )}
      />
      <div>
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving…" : "Save my information"}</Button>
      </div>
    </form>
  );
}
