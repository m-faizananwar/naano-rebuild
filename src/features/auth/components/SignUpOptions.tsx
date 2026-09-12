"use client";

import Link from "next/link";
import { useState } from "react";
import type { Role } from "../schemas";
import { RegisterForm } from "./RegisterForm";
import { SocialAuthButtons } from "./SocialAuthButtons";

import { BRAND } from "@/config/brand";
const COPY: Record<Role, { eyebrow?: string; title: string; sub: string }> = {
  brand: { title: `Join ${BRAND.name}`, sub: "The #1 platform to run LinkedIn creator campaigns that drive real business." },
  creator: { eyebrow: "Step 1 of 4", title: `Join ${BRAND.name}`, sub: "Get paid to create LinkedIn content for B2B brands you actually use." },
};

// Step 1 of naano's sign-up: pick LinkedIn / Google / email. Email reveals
// the real form; the others are visual-only in this build.
export function SignUpOptions({ role }: { role: Role }) {
  const [showForm, setShowForm] = useState(false);
  if (showForm) return <RegisterForm role={role} onBack={() => setShowForm(false)} />;
  const copy = COPY[role];
  return (
    <div>
      {copy.eyebrow ? <p className="text-xs font-semibold uppercase tracking-wider text-brand">{copy.eyebrow}</p> : null}
      <h1 className="mt-2 text-3xl font-bold tracking-tight">{copy.title}</h1>
      {role === "brand" ? <p className="mt-4 font-semibold text-brand">Creators. Brands. Results.</p> : null}
      <p className="mt-2 text-sm text-muted-foreground">{copy.sub}</p>
      <div className="mt-6">
        <SocialAuthButtons mode="signup" onEmail={() => setShowForm(true)} />
      </div>
      <p className="mt-5 text-center text-xs text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-brand hover:underline">
          Sign in here
        </Link>
      </p>
    </div>
  );
}
