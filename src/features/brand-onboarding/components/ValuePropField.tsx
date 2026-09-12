"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { COPY } from "../constants";
import type { ProfileInput } from "../schemas";

type Props = { register: UseFormRegister<ProfileInput>; errors: FieldErrors<ProfileInput>; readFailedUrl: string | null };

const ROWS = 7;

// VALUE PROPOSITION textarea, with the "we couldn't read {url}" notice above
// it when step 1 fell back to the template.
export function ValuePropField({ register, errors, readFailedUrl }: Props) {
  return (
    <div className="grid gap-1.5">
      {readFailedUrl ? (
        <p role="status" className="mb-3 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm">
          We couldn&apos;t read {readFailedUrl}; we prepared a draft from your company name — edit it below.
        </p>
      ) : null}
      <Label htmlFor="valueProp" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {COPY.profile.valuePropLabel}
      </Label>
      <p className="text-sm text-muted-foreground">{COPY.profile.valuePropHint}</p>
      <Textarea id="valueProp" rows={ROWS} className="text-sm leading-relaxed" {...register("valueProp")} />
      {errors.valueProp ? (
        <p className="text-sm text-destructive" role="alert">
          {errors.valueProp.message}
        </p>
      ) : null}
    </div>
  );
}
