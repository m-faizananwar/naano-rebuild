"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ProfileInput } from "../schemas";

type Props = { index: number; register: UseFormRegister<ProfileInput>; errors: FieldErrors<ProfileInput> };

// One numbered, editable ICP card (title + paragraph).
export function IcpCardFields({ index, register, errors }: Props) {
  const number = index + 1;
  const titleId = `icp-${number}-title`;
  const descriptionId = `icp-${number}-description`;
  const fieldErrors = errors.icps?.[index];
  return (
    <fieldset className="rounded-2xl border bg-background p-4">
      <legend className="sr-only">Ideal customer {number}</legend>
      <div className="flex items-start gap-3">
        <span aria-hidden="true" className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-brand-foreground">
          {number}
        </span>
        <div className="grid flex-1 gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor={titleId} className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              ICP {number} — title
            </Label>
            <Input id={titleId} className="font-semibold" {...register(`icps.${index}.title` as const)} />
            {fieldErrors?.title ? (
              <p className="text-sm text-destructive" role="alert">
                {fieldErrors.title.message}
              </p>
            ) : null}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor={descriptionId} className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Who they are
            </Label>
            <Textarea id={descriptionId} rows={4} className="text-sm leading-relaxed" {...register(`icps.${index}.description` as const)} />
            {fieldErrors?.description ? (
              <p className="text-sm text-destructive" role="alert">
                {fieldErrors.description.message}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </fieldset>
  );
}
