import { z } from "zod";
import { INDUSTRIES } from "@/features/workspace/constants";
import { PRICE_CAP_CENTS, PRICE_FLOOR_CENTS } from "@/lib/recommend-price";
import {
  BUNDLE_MAX_POSTS, BUNDLE_MIN_POSTS, COUNTRY_CODES, HEADLINE_MAX, LEGAL_ADDRESS_MAX, LEGAL_TEXT_MAX, LINKEDIN_URL_MAX,
  MAX_BUNDLES, MAX_INDUSTRIES,
} from "./constants";

export type ActionResult<T = undefined> = { ok: true; data: T } | { ok: false; error: string };

const countryCode = z.enum(COUNTRY_CODES, { message: "Choose a country" });

export const linkedinSchema = z.object({
  linkedinUrl: z
    .string()
    .trim()
    .min(1, "Paste your public LinkedIn profile URL")
    .max(LINKEDIN_URL_MAX)
    .regex(/linkedin\.com\/in\/[A-Za-z0-9._-]+/i, "Use a public profile URL like https://www.linkedin.com/in/your-name"),
});
export type LinkedinInput = z.infer<typeof linkedinSchema>;

export const cardSchema = z.object({
  headline: z.string().trim().min(1, "Add a headline").max(HEADLINE_MAX, `Keep it under ${HEADLINE_MAX} characters`),
  country: countryCode,
  industries: z
    .array(z.enum(INDUSTRIES))
    .min(1, "Pick at least one industry")
    .max(MAX_INDUSTRIES, `Pick up to ${MAX_INDUSTRIES} industries`),
});
export type CardInput = z.infer<typeof cardSchema>;

export const bundleSchema = z.object({
  posts: z.number().int().min(BUNDLE_MIN_POSTS, `At least ${BUNDLE_MIN_POSTS} posts`).max(BUNDLE_MAX_POSTS, `At most ${BUNDLE_MAX_POSTS} posts`),
  totalCents: z.number().int().min(PRICE_FLOOR_CENTS, "Set a total net price"),
});
export const priceSchema = z.object({
  priceCents: z
    .number({ message: "Enter a price" })
    .int()
    .min(PRICE_FLOOR_CENTS, "The minimum is €20 per post")
    .max(PRICE_CAP_CENTS, "The maximum is €1,500 per post"),
  bundles: z.array(bundleSchema).max(MAX_BUNDLES, `Up to ${MAX_BUNDLES} bundles`),
});
export type PriceInput = z.infer<typeof priceSchema>;

export const professionalSchema = z.object({
  legalCountry: countryCode,
  registeredBusiness: z.boolean(),
  legalName: z.string().trim().min(1, "Enter the legal name").max(LEGAL_TEXT_MAX),
  legalAddress: z.string().trim().min(1, "Enter the legal address").max(LEGAL_ADDRESS_MAX),
  taxAcknowledged: z.literal(true, { message: "Please confirm" }),
  invoicingAuthorized: z.literal(true, { message: "Please confirm" }),
});
export type ProfessionalInput = z.infer<typeof professionalSchema>;
