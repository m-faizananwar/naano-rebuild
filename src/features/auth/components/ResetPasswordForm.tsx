"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type ResetPasswordInput, resetPasswordSchema } from "../schemas";
import { resetPassword } from "../server/reset-actions";
import { FormField } from "./FormField";

const INPUT = "h-12 rounded-xl px-4";

// New password + confirm; on success the action has already signed the user
// in, so we just go to their shell.
export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<ResetPasswordInput>({ resolver: zodResolver(resetPasswordSchema), defaultValues: { token, password: "", confirm: "" } });
  const { errors, isSubmitting } = form.formState;

  async function onSubmit(values: ResetPasswordInput) {
    setServerError(null);
    const result = await resetPassword(values);
    if (!result.ok) {
      setServerError(result.error);
      return;
    }
    router.push(result.data.redirectTo);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5" noValidate>
      <input type="hidden" {...form.register("token")} />
      <FormField id="password" label="New password" error={errors.password?.message}>
        <Input id="password" type="password" autoComplete="new-password" placeholder="At least 8 characters" className={INPUT} {...form.register("password")} />
      </FormField>
      <FormField id="confirm" label="Confirm password" error={errors.confirm?.message}>
        <Input id="confirm" type="password" autoComplete="new-password" placeholder="••••••••" className={INPUT} {...form.register("confirm")} />
      </FormField>
      {serverError ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive" role="alert">
          {serverError}
        </p>
      ) : null}
      <Button type="submit" size="lg" disabled={isSubmitting} className="h-12 rounded-xl bg-brand text-base text-brand-foreground hover:bg-brand/90">
        {isSubmitting ? "Saving…" : "Set new password"}
      </Button>
    </form>
  );
}
