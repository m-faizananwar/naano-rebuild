import { z } from "zod";
import { HEARD_ABOUT_OPTIONS } from "./constants";

export const roleSchema = z.enum(["brand", "creator"]);
export type Role = z.infer<typeof roleSchema>;

const PASSWORD_MIN = 8;

export const registerSchema = z.object({
  role: roleSchema,
  firstName: z.string().trim().min(1, "First name is required").max(80),
  lastName: z.string().trim().min(1, "Last name is required").max(80),
  email: z.string().trim().toLowerCase().email("Enter a valid business email"),
  password: z.string().min(PASSWORD_MIN, `At least ${PASSWORD_MIN} characters`).max(200),
  heardAbout: z.enum(HEARD_ABOUT_OPTIONS).optional(),
  // Creator handle from a Deal Link / referral link (?ref=), attributed on brand sign-up.
  ref: z.string().trim().max(80).regex(/^[a-z0-9-]*$/).optional(),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
export type LoginInput = z.infer<typeof loginSchema>;

// Every server action returns this shape; nothing throws to the client.
export type ActionResult<T = undefined> = { ok: true; data: T } | { ok: false; error: string };

export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
});
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1).max(200),
    password: z.string().min(PASSWORD_MIN, `At least ${PASSWORD_MIN} characters`).max(200),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, { message: "Passwords don't match", path: ["confirm"] });
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
