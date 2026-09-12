"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toDateInputValue } from "@/lib/dates";
import { type ScheduleFormInput, scheduleFormSchema } from "../../schemas";

type Props = { dueDate: string | null; disabled: boolean; onSubmit: (values: ScheduleFormInput) => Promise<boolean> };

export function ScheduleForm({ dueDate, disabled, onSubmit }: Props) {
  const today = toDateInputValue(new Date());
  const form = useForm<ScheduleFormInput>({ resolver: zodResolver(scheduleFormSchema), defaultValues: { scheduledAt: today } });
  const { errors, isSubmitting } = form.formState;
  const max = dueDate ? toDateInputValue(new Date(dueDate)) : undefined;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3 sm:flex-row sm:items-end" noValidate>
      <div className="grid gap-1.5">
        <Label htmlFor="scheduledAt">Publish date</Label>
        <Input id="scheduledAt" type="date" min={today} max={max} aria-invalid={Boolean(errors.scheduledAt)} {...form.register("scheduledAt")} />
        {errors.scheduledAt ? <p className="text-xs text-destructive">{errors.scheduledAt.message}</p> : null}
      </div>
      <Button type="submit" disabled={disabled || isSubmitting} className="bg-brand text-brand-foreground hover:bg-brand/90">
        {isSubmitting ? "Saving…" : "Schedule"}
      </Button>
    </form>
  );
}
