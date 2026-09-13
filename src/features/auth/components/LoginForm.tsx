"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type LoginInput, loginSchema } from "../schemas";
import { login } from "../server/actions";
import { FormField } from "./FormField";

const INPUT = "h-12 rounded-xl px-4";

export function LoginForm({ next }: { next?: string }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<LoginInput>({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" } });
  const { errors, isSubmitting } = form.formState;

  async function onSubmit(values: LoginInput) {
    setServerError(null);
    const result = await login(values);
    if (!result.ok) {
      setServerError(result.error);
      return;
    }
    router.push(next && next.startsWith("/") ? next : result.data.redirectTo);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5" noValidate>
      <FormField id="email" label="Email" error={errors.email?.message}>
        <Input id="email" type="email" autoComplete="email" placeholder="john@company.com" className={INPUT} {...form.register("email")} />
      </FormField>
      <FormField id="password" label="Password" error={errors.password?.message}>
        <Input id="password" type="password" autoComplete="current-password" placeholder="••••••••" className={INPUT} {...form.register("password")} />
        <Link href="/forgot-password" className="justify-self-end text-xs font-semibold text-brand hover:underline">
          Forgot password?
        </Link>
      </FormField>
      {serverError ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive" role="alert">
          {serverError}
        </p>
      ) : null}
      <Button type="submit" size="lg" disabled={isSubmitting} className="h-12 rounded-xl bg-brand text-base text-brand-foreground hover:bg-brand/90">
        {isSubmitting ? "Signing in…" : "Sign in"}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-brand hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}
