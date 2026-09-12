"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GEOGRAPHIES, INDUSTRIES } from "../../constants";
import { type Brief, type BriefFormValues, briefSchema } from "../../schemas";
import { saveBrief } from "../../server/actions";
import { AngleFields } from "./AngleFields";
import { BriefReadView } from "./BriefReadView";
import { ChipSelectField } from "./ChipSelectField";
import { LineListField } from "./LineListField";

type Props = { campaignId: string; initial: Brief; cancelHref: string; afterSaveHref: string; saveLabel?: string };

function TextField({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
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

// The brief editor: exactly naano's fields, in their order. Used by the launch
// stepper and by Brief › "Edit the brief".
export function BriefEditor({ campaignId, initial, cancelHref, afterSaveHref, saveLabel = "Save" }: Props) {
  const router = useRouter();
  const [preview, setPreview] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<BriefFormValues, unknown, Brief>({ resolver: zodResolver(briefSchema), defaultValues: initial });
  const { errors, isSubmitting } = form.formState;

  async function onSubmit(brief: Brief) {
    setServerError(null);
    const result = await saveBrief({ campaignId, brief });
    if (!result.ok) {
      setServerError(result.error);
      return;
    }
    toast.success("Brief saved");
    router.push(afterSaveHref);
    router.refresh();
  }

  const actions = (
    <div className="flex flex-wrap items-center gap-2">
      <Button type="button" variant="outline" onClick={() => setPreview((p) => !p)} aria-pressed={preview}>
        {preview ? "Back to editing" : "Preview"}
      </Button>
      <Link href={cancelHref} className={buttonVariants({ variant: "ghost" })}>
        Cancel
      </Link>
      <Button type="submit" disabled={isSubmitting} className="bg-brand text-brand-foreground hover:bg-brand/90">
        {isSubmitting ? "Saving…" : saveLabel}
      </Button>
    </div>
  );

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="grid gap-6">
      {preview ? (
        <BriefReadView brief={briefSchema.safeParse(form.getValues()).data ?? initial} />
      ) : (
        <div className="grid gap-6 rounded-2xl border bg-background p-5">
          <TextField id="whatToTell" label="What creators should tell" error={errors.whatToTell?.message}>
            <Textarea id="whatToTell" rows={6} {...form.register("whatToTell")} />
          </TextField>
          <ChipSelectField control={form.control} name="targetIndustries" label="Target industries" options={INDUSTRIES} />
          <ChipSelectField control={form.control} name="targetGeos" label="Target geographies" options={GEOGRAPHIES} />
          <TextField id="tone" label="Tone" error={errors.tone?.message}>
            <Input id="tone" {...form.register("tone")} />
          </TextField>
          <LineListField control={form.control} name="do" label="Do" placeholder="A rule creators should follow" />
          <LineListField control={form.control} name="avoid" label="Avoid" placeholder="Something creators must not do" />
          <LineListField control={form.control} name="links" label="Links and examples" placeholder="https://" type="url" />
          <AngleFields control={form.control} register={form.register} errors={errors} />
        </div>
      )}
      {serverError ? (
        <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {serverError}
        </p>
      ) : null}
      {actions}
    </form>
  );
}
