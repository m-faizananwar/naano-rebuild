"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type PublishFormInput, publishFormSchema } from "../../schemas";

type Props = { disabled: boolean; onSubmit: (values: PublishFormInput) => Promise<boolean> };

// No LinkedIn API, so publication is self-reported with the post URL.
export function PublishForm({ disabled, onSubmit }: Props) {
  const form = useForm<PublishFormInput>({ resolver: zodResolver(publishFormSchema), defaultValues: { postUrl: "" } });
  const { errors, isSubmitting } = form.formState;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3" noValidate>
      <div className="grid gap-1.5">
        <Label htmlFor="postUrl">LinkedIn post URL</Label>
        <Input
          id="postUrl"
          type="url"
          inputMode="url"
          placeholder="https://www.linkedin.com/posts/…"
          aria-invalid={Boolean(errors.postUrl)}
          {...form.register("postUrl")}
        />
        {errors.postUrl ? <p className="text-xs text-destructive">{errors.postUrl.message}</p> : null}
      </div>
      <div>
        <Button type="submit" disabled={disabled || isSubmitting} className="bg-brand text-brand-foreground hover:bg-brand/90">
          {isSubmitting ? "Saving…" : "Mark as published"}
        </Button>
      </div>
    </form>
  );
}
