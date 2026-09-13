"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type ForgotPasswordInput, forgotPasswordSchema } from "../schemas";
import { requestPasswordReset } from "../server/reset-actions";
import { FormField } from "./FormField";

const INPUT = "h-12 rounded-xl px-4";

type Outcome = { email: string; resetUrl: string | null } | null;

// Same styling as the login form. On success the link that would have been
// emailed is shown on screen, clearly labelled — no email is sent in this build.
export function ForgotPasswordForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [outcome, setOutcome] = useState<Outcome>(null);
  const form = useForm<ForgotPasswordInput>({ resolver: zodResolver(forgotPasswordSchema), defaultValues: { email: "" } });
  const { errors, isSubmitting } = form.formState;

  async function onSubmit(values: ForgotPasswordInput) {
    setServerError(null);
    const result = await requestPasswordReset(values);
    if (!result.ok) {
      setServerError(result.error);
      return;
    }
    setOutcome({ email: values.email, resetUrl: result.data.resetUrl });
  }

  if (outcome) return <ResetLinkBox outcome={outcome} onRetry={() => setOutcome(null)} />;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5" noValidate>
      <FormField id="email" label="Email" error={errors.email?.message}>
        <Input id="email" type="email" autoComplete="email" placeholder="john@company.com" className={INPUT} {...form.register("email")} />
      </FormField>
      {serverError ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive" role="alert">
          {serverError}
        </p>
      ) : null}
      <Button type="submit" size="lg" disabled={isSubmitting} className="h-12 rounded-xl bg-brand text-base text-brand-foreground hover:bg-brand/90">
        {isSubmitting ? "Creating link…" : "Send reset link"}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        Remembered it?{" "}
        <Link href="/login" className="font-semibold text-brand hover:underline">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}

function ResetLinkBox({ outcome, onRetry }: { outcome: NonNullable<Outcome>; onRetry: () => void }) {
  return (
    <div className="grid gap-4" role="status">
      {outcome.resetUrl ? (
        <div className="rounded-2xl border border-brand/30 bg-brand-soft/60 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand">No email is sent in this build</p>
          <p className="mt-2 text-sm text-muted-foreground">Here&apos;s the link we&apos;d have sent to {outcome.email}. It works once and expires in 30 minutes.</p>
          <Link href={outcome.resetUrl} className="mt-3 block break-all rounded-lg bg-background px-3 py-2 font-mono text-xs text-brand ring-1 ring-border hover:underline">
            {outcome.resetUrl}
          </Link>
        </div>
      ) : (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          No account uses {outcome.email}. Check the spelling, or{" "}
          <Link href="/register" className="font-semibold underline">create an account</Link>.
        </p>
      )}
      <Button type="button" variant="outline" onClick={onRetry} className="h-12 rounded-xl">
        Try another email
      </Button>
    </div>
  );
}
