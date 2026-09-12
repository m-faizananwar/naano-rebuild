"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ANALYSIS_MIN_MS, COPY, ONBOARDING_ROUTES } from "../constants";
import { type WebsiteInput, websiteSchema } from "../schemas";
import { analyzeWebsite } from "../server/actions";
import { AnalysisProgress } from "./AnalysisProgress";

type Props = { website: string | null; onboarded: boolean };

function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

// The animation runs at least minMs so the staged messages read naturally; a
// slow site simply holds the last stage until the server answers. Errors
// come back straight away.
async function withMinimumDelay<T>(task: Promise<T>, minMs: number, shouldWait: (result: T) => boolean): Promise<T> {
  const startedAt = Date.now();
  const result = await task;
  if (shouldWait(result)) await sleep(Math.max(0, minMs - (Date.now() - startedAt)));
  return result;
}

export function WebsiteStepForm({ website, onboarded }: Props) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [running, setRunning] = useState<string | null>(null);
  const form = useForm<WebsiteInput>({ resolver: zodResolver(websiteSchema), defaultValues: { url: website ?? "" } });
  const { errors } = form.formState;

  async function onSubmit(values: WebsiteInput) {
    setServerError(null);
    setRunning(values.url);
    const result = await withMinimumDelay(analyzeWebsite(values), ANALYSIS_MIN_MS, (r) => r.ok);
    if (!result.ok) {
      setRunning(null);
      setServerError(result.error);
      return;
    }
    router.push(result.data.read ? ONBOARDING_ROUTES.profile : `${ONBOARDING_ROUTES.profile}?read=failed`);
  }

  if (running) return <AnalysisProgress url={running} />;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5" noValidate>
      <div className="grid gap-1.5">
        <Label htmlFor="website" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Website
        </Label>
        <Input id="website" type="url" inputMode="url" autoComplete="url" placeholder={COPY.website.placeholder} className="h-12 rounded-xl px-4" {...form.register("url")} />
        {errors.url ? (
          <p className="text-sm text-destructive" role="alert">
            {errors.url.message}
          </p>
        ) : null}
      </div>
      {serverError ? (
        <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {serverError}
        </p>
      ) : null}
      <Button type="submit" size="lg" className="h-12 rounded-xl bg-brand text-base font-semibold text-brand-foreground hover:bg-brand/90">
        {COPY.website.submit}
      </Button>
      {onboarded ? (
        <p className="text-center text-xs text-muted-foreground">
          Your workspace is already set up. Analyzing again updates your profile and keeps your existing campaigns.
        </p>
      ) : null}
    </form>
  );
}
