import type { Metadata } from "next";
import { BRAND } from "@/config/brand";
import { AuthSplitLayout } from "@/features/auth/components/AuthSplitLayout";
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";

export const metadata: Metadata = { title: `Forgot password · ${BRAND.wordmark}` };

export default function ForgotPasswordPage() {
  return (
    <AuthSplitLayout>
      <h1 className="text-3xl font-bold tracking-tight">Forgot your password?</h1>
      <p className="mt-2 text-sm text-muted-foreground">Enter your email and we&apos;ll make you a reset link.</p>
      <div className="mt-8">
        <ForgotPasswordForm />
      </div>
    </AuthSplitLayout>
  );
}
