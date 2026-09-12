import { z } from "zod";

export const NEWSLETTER_EMAIL_MAX = 254;

export const newsletterSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address.").max(NEWSLETTER_EMAIL_MAX),
});
export type NewsletterInput = z.infer<typeof newsletterSchema>;

export type PublicActionResult<T = undefined> = { ok: true; data: T } | { ok: false; error: string };
