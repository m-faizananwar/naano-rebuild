"use client";

import { Plus, Trash2 } from "lucide-react";
import { type Control, type FieldErrors, useFieldArray, type UseFormRegister } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BRIEF_ANGLES_MAX } from "../../constants";
import type { BriefFormValues } from "../../schemas";

type Props = { control: Control<BriefFormValues>; register: UseFormRegister<BriefFormValues>; errors: FieldErrors<BriefFormValues> };

const EMPTY_ANGLE = { angle: "", hook: "", direction: "", example: "" };

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

export function AngleFields({ control, register, errors }: Props) {
  const { fields, append, remove } = useFieldArray({ control, name: "angles" });
  return (
    <fieldset>
      <legend className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Angles & post examples</legend>
      <div className="mt-2 space-y-4">
        {fields.map((field, index) => (
          <article key={field.id} className="rounded-xl border p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-muted-foreground tabular-nums">{String(index + 1).padStart(2, "0")}</p>
              <button type="button" onClick={() => remove(index)} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive">
                <Trash2 className="size-3.5" aria-hidden="true" /> Remove
              </button>
            </div>
            <div className="mt-3 grid gap-3">
              <Field id={`angle-${index}`} label="Angle" error={errors.angles?.[index]?.angle?.message}>
                <Input id={`angle-${index}`} {...register(`angles.${index}.angle`)} />
              </Field>
              <Field id={`hook-${index}`} label="Hook">
                <Input id={`hook-${index}`} {...register(`angles.${index}.hook`)} />
              </Field>
              <Field id={`direction-${index}`} label="Editorial direction">
                <Textarea id={`direction-${index}`} rows={3} {...register(`angles.${index}.direction`)} />
              </Field>
              <Field id={`example-${index}`} label="Post example">
                <Textarea id={`example-${index}`} rows={4} {...register(`angles.${index}.example`)} />
              </Field>
            </div>
          </article>
        ))}
      </div>
      <button
        type="button"
        disabled={fields.length >= BRIEF_ANGLES_MAX}
        onClick={() => append(EMPTY_ANGLE)}
        className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline disabled:opacity-50"
      >
        <Plus className="size-4" aria-hidden="true" /> Add an angle
      </button>
    </fieldset>
  );
}
