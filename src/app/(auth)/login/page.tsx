import type { Metadata } from "next";
import { Separator } from "@/components/ui/separator";
import { AuthSplitLayout } from "@/features/auth/components/AuthSplitLayout";
import { DemoLoginButtons } from "@/features/auth/components/DemoLoginButtons";
import { LoginForm } from "@/features/auth/components/LoginForm";

export const metadata: Metadata = { title: "Sign in · naano" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return (
    <AuthSplitLayout panelTitle="Creators. Brands. Results." panelBody="Sign in to your workspace, or explore the product as a demo brand or creator.">
      <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
      <p className="mt-2 text-sm text-muted-foreground">Sign in to continue to your workspace.</p>
      <div className="mt-8">
        <DemoLoginButtons />
      </div>
      <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wide text-muted-foreground">
        <Separator className="flex-1" />
        or sign in
        <Separator className="flex-1" />
      </div>
      <LoginForm next={next} />
    </AuthSplitLayout>
  );
}
