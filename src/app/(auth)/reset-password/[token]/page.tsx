import type { Metadata } from "next";
import Link from "next/link";
import { BRAND } from "@/config/brand";
import { AuthSplitLayout } from "@/features/auth/components/AuthSplitLayout";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";
import { getResetTokenState } from "@/features/auth/server/reset-queries";

export const metadata: Metadata = { title: `Reset password · ${BRAND.wordmark}` };
export const dynamic = "force-dynamic";

const REASON: Record<string, string> = {
  missing: "This reset link isn't one we made.",
  expired: "This reset link has expired — they last 30 minutes.",
  used: "This reset link was already used.",
  unconfigured: "Password reset needs the database, which isn't configured on this deployment.",
  unavailable: "Password reset isn't available right now. Try again in a little while.",
};

export default async function ResetPasswordPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const state = await getResetTokenState(token);
  return (
    <AuthSplitLayout>
      {state === "valid" ? (
        <>
          <h1 className="text-3xl font-bold tracking-tight">Choose a new password</h1>
          <p className="mt-2 text-sm text-muted-foreground">You&apos;ll be signed in straight after.</p>
          <div className="mt-8">
            <ResetPasswordForm token={token} />
          </div>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold tracking-tight">That link doesn&apos;t work anymore</h1>
          <p className="mt-2 text-sm text-muted-foreground">{REASON[state]}</p>
          <div className="mt-8 grid gap-3">
            <Link href="/forgot-password" className="inline-flex h-12 items-center justify-center rounded-xl bg-brand px-5 text-base font-semibold text-brand-foreground hover:bg-brand/90">
              Request a new link
            </Link>
            <Link href="/login" className="text-center text-sm font-semibold text-brand hover:underline">
              Back to sign in
            </Link>
          </div>
        </>
      )}
    </AuthSplitLayout>
  );
}
