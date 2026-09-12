import type { Metadata } from "next";
import { Separator } from "@/components/ui/separator";
import { AuthSplitLayout } from "@/features/auth/components/AuthSplitLayout";
import { DemoLoginButtons } from "@/features/auth/components/DemoLoginButtons";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { SocialAuthButtons } from "@/features/auth/components/SocialAuthButtons";

export const metadata: Metadata = { title: "Sign in · naano" };

function Divider({ label }: { label: string }) {
  return (
    <div className="my-6 flex items-center gap-3 text-[0.65rem] font-medium uppercase tracking-wider text-muted-foreground">
      <Separator className="flex-1" />
      {label}
      <Separator className="flex-1" />
    </div>
  );
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return (
    <AuthSplitLayout panelTitle="Welcome back." panelBody="Sign in to manage your campaigns, creators and payouts, all in one place.">
      <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
      <p className="mt-2 text-sm text-muted-foreground">Sign in to your account</p>
      <div className="mt-6 rounded-2xl bg-brand-soft/60 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-brand">Explore without an account</p>
        <DemoLoginButtons />
      </div>
      <Divider label="or" />
      <SocialAuthButtons mode="signin" />
      <Divider label="or continue with email" />
      <LoginForm next={next} />
    </AuthSplitLayout>
  );
}
