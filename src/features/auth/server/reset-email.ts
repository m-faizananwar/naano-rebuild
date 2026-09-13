import "server-only";
import { Resend } from "resend";
import { BRAND } from "@/config/brand";
import { RESET_EMAIL_FROM, RESET_EMAIL_SUBJECT } from "../constants";

// The one email this build sends: the password reset link, via Resend when
// RESEND_API_KEY is set. Returns whether it went out; the reason never
// reaches the user (Resend's free plan only delivers to the account owner,
// so most addresses fail) — it is logged server side and the page falls back
// to the on-screen link.
export async function sendResetEmail(to: string, resetUrl: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  try {
    const resend = new Resend(key);
    const { error } = await resend.emails.send({
      from: RESET_EMAIL_FROM,
      to,
      subject: RESET_EMAIL_SUBJECT,
      html: resetEmailHtml(resetUrl),
    });
    if (error) {
      console.error("[auth] reset email rejected", { to, error });
      return false;
    }
    return true;
  } catch (error) {
    console.error("[auth] reset email failed", { to, error });
    return false;
  }
}

function resetEmailHtml(resetUrl: string) {
  return [
    `<p>Someone asked to reset the password for this ${BRAND.name} account.</p>`,
    `<p><a href="${resetUrl}">Set a new password</a></p>`,
    `<p>The link works once and expires in 30 minutes. If you didn't ask for it, ignore this email.</p>`,
    `<p style="color:#6b7178;font-size:12px">${resetUrl}</p>`,
  ].join("\n");
}
