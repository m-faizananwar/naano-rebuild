"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HEARD_ABOUT_OPTIONS } from "../constants";
import { type RegisterInput, type Role, registerSchema } from "../schemas";
import { register } from "../server/actions";
import { FormField } from "./FormField";

const COPY: Record<Role, { eyebrow?: string; title: string; sub: string }> = {
  brand: { title: "Join Naano", sub: "The #1 platform to run LinkedIn creator campaigns that drive real business." },
  creator: { eyebrow: "Step 1 of 4", title: "Join Naano", sub: "Get paid to create LinkedIn content for B2B brands you actually use." },
};

const INPUT = "h-12 rounded-xl px-4";
const BACK = "inline-flex items-center gap-2 text-sm text-foreground/80 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 rounded-md";

// onBack: when rendered behind the sign-up options, "back" returns to them
// instead of leaving the page.
export function RegisterForm({ role, onBack }: { role: Role; onBack?: () => void }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role, firstName: "", lastName: "", email: "", password: "" },
  });
  const { errors, isSubmitting } = form.formState;

  async function onSubmit(values: RegisterInput) {
    setServerError(null);
    const result = await register(values);
    if (!result.ok) {
      setServerError(result.error);
      return;
    }
    router.push(result.data.redirectTo);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5" noValidate>
      <div>
        {onBack ? (
          <button type="button" onClick={onBack} className={BACK}>
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to sign-up options
          </button>
        ) : (
          <Link href="/register" className={BACK}>
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to sign-up options
          </Link>
        )}
        {COPY[role].eyebrow ? <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-brand">{COPY[role].eyebrow}</p> : null}
        <h1 className="mt-2 text-3xl font-bold tracking-tight">{COPY[role].title}</h1>
        {role === "brand" ? <p className="mt-4 font-semibold text-brand">Creators. Brands. Results.</p> : null}
        <p className="mt-2 text-sm text-muted-foreground">{COPY[role].sub}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="firstName" label="First name" error={errors.firstName?.message}>
          <Input id="firstName" autoComplete="given-name" className={INPUT} {...form.register("firstName")} />
        </FormField>
        <FormField id="lastName" label="Last name" error={errors.lastName?.message}>
          <Input id="lastName" autoComplete="family-name" className={INPUT} {...form.register("lastName")} />
        </FormField>
      </div>
      <FormField id="email" label={role === "brand" ? "Business email" : "Email"} error={errors.email?.message}>
        <Input id="email" type="email" autoComplete="email" placeholder={role === "brand" ? "you@company.com" : "you@example.com"} className={INPUT} {...form.register("email")} />
      </FormField>
      <FormField id="password" label="Password" error={errors.password?.message}>
        <Input id="password" type="password" autoComplete="new-password" placeholder="Create a strong password" className={INPUT} {...form.register("password")} />
      </FormField>
      <Controller
        control={form.control}
        name="heardAbout"
        render={({ field }) => (
          <fieldset className="grid gap-2">
            <legend className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">How did you hear about us?</legend>
            <div className="flex flex-wrap gap-2">
              {HEARD_ABOUT_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={field.value === option}
                  onClick={() => field.onChange(field.value === option ? undefined : option)}
                  className="rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 aria-pressed:border-brand aria-pressed:bg-brand aria-pressed:text-brand-foreground"
                >
                  {option}
                </button>
              ))}
            </div>
          </fieldset>
        )}
      />
      {serverError ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive" role="alert">
          {serverError}
        </p>
      ) : null}
      <Button type="submit" size="lg" disabled={isSubmitting} className="h-12 rounded-xl bg-brand text-base text-brand-foreground hover:bg-brand/90">
        {isSubmitting ? "Creating your account…" : "Continue"}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-brand hover:underline">
          Sign in here
        </Link>
      </p>
    </form>
  );
}
