"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { type DraftFormInput, draftFormSchema } from "../../schemas";
import { DRAFT_MAX_CHARS, DRAFT_MIN_CHARS } from "../../ui-constants";

type Props = { initialText: string; submitLabel: string; disabled: boolean; onSubmit: (values: DraftFormInput) => Promise<boolean> };

const ROWS = 10;

// Used for the first draft and every resubmission (prefilled with the last one).
export function DraftForm({ initialText, submitLabel, disabled, onSubmit }: Props) {
  const form = useForm<DraftFormInput>({ resolver: zodResolver(draftFormSchema), defaultValues: { draftText: initialText } });
  const { errors, isSubmitting } = form.formState;
  const length = useWatch({ control: form.control, name: "draftText" }).length;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3" noValidate>
      <div className="grid gap-1.5">
        <Label htmlFor="draftText">Your LinkedIn post</Label>
        <Textarea
          id="draftText"
          rows={ROWS}
          aria-invalid={Boolean(errors.draftText)}
          aria-describedby="draftText-hint"
          placeholder="Write the post as it will appear on LinkedIn — hook first, one clear CTA, disclosure included."
          {...form.register("draftText")}
        />
        <p id="draftText-hint" className="flex justify-between text-xs text-muted-foreground">
          <span>{errors.draftText ? <span className="text-destructive">{errors.draftText.message}</span> : `At least ${DRAFT_MIN_CHARS} characters.`}</span>
          <span>
            {length}/{DRAFT_MAX_CHARS}
          </span>
        </p>
      </div>
      <div>
        <Button type="submit" disabled={disabled || isSubmitting} className="bg-brand text-brand-foreground hover:bg-brand/90">
          {isSubmitting ? "Sending…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
