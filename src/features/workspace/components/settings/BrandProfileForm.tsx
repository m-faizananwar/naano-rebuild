"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { type BrandProfileInput, brandProfileSchema } from "../../schemas";
import { updateBrandProfile } from "../../server/actions";

export function BrandProfileForm({ defaults }: { defaults: BrandProfileInput }) {
  const router = useRouter();
  const form = useForm<BrandProfileInput>({ resolver: zodResolver(brandProfileSchema), defaultValues: defaults });
  const { errors, isSubmitting } = form.formState;

  async function onSubmit(values: BrandProfileInput) {
    const result = await updateBrandProfile(values);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Profile saved");
    router.refresh();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4" noValidate>
      <div className="grid gap-1.5">
        <Label htmlFor="company">Your company</Label>
        <Input id="company" {...form.register("company")} />
        {errors.company ? <p className="text-sm text-destructive">{errors.company.message}</p> : null}
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="website">Website</Label>
        <Input id="website" placeholder="https://yourcompany.com" {...form.register("website")} />
        {errors.website ? <p className="text-sm text-destructive">{errors.website.message}</p> : null}
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="valueProp">One-line positioning</Label>
        <Textarea id="valueProp" rows={4} {...form.register("valueProp")} />
        <p className="text-xs text-muted-foreground">Creators see this as &quot;Why we exist&quot; in every brief.</p>
      </div>
      <div>
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving…" : "Save changes"}</Button>
      </div>
    </form>
  );
}
