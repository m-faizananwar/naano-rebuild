import { z } from "zod";
import {
  COMPANY_MAX_CHARS, ICP_COUNT, ICP_DESCRIPTION_MAX_CHARS, ICP_TITLE_MAX_CHARS, VALUE_PROP_MAX_CHARS, WEBSITE_URL_MAX_CHARS,
} from "./constants";

// ---- step 1: the website -----------------------------------------------------------

const HAS_SCHEME = /^[a-z][a-z0-9+.-]*:/i;
const HTTP_SCHEME = /^https?:\/\//i;

// "yourcompany.com" is accepted and normalised to https://; other schemes are refused.
export const websiteSchema = z.object({
  url: z
    .string()
    .trim()
    .min(1, "Enter your website address")
    .max(WEBSITE_URL_MAX_CHARS)
    .transform((value) => (HAS_SCHEME.test(value) ? value : `https://${value}`))
    .pipe(z.string().url("Enter a full address like https://yourcompany.com").regex(HTTP_SCHEME, "Only http and https addresses can be read")),
});
export type WebsiteInput = z.input<typeof websiteSchema>;

// ---- step 2: the profile -----------------------------------------------------------

export const icpSchema = z.object({
  title: z.string().trim().min(1, "Name this ideal customer").max(ICP_TITLE_MAX_CHARS),
  description: z.string().trim().min(1, "Describe this ideal customer").max(ICP_DESCRIPTION_MAX_CHARS),
});
export type Icp = z.infer<typeof icpSchema>;

export const profileSchema = z.object({
  valueProp: z.string().trim().min(1, "Write the value proposition").max(VALUE_PROP_MAX_CHARS),
  icps: z.array(icpSchema).length(ICP_COUNT, `Describe ${ICP_COUNT} ideal customers`),
});
export type ProfileInput = z.infer<typeof profileSchema>;

// What the AI (or the template) writes from the website. The wire schema for
// the model mirrors this without the limits; the response is re-validated here.
export const generatedProfileSchema = z.object({
  company: z.string().trim().min(1).max(COMPANY_MAX_CHARS),
  valueProp: z.string().trim().min(1).max(VALUE_PROP_MAX_CHARS),
  icps: z.array(icpSchema).length(ICP_COUNT),
});
export type GeneratedProfile = z.infer<typeof generatedProfileSchema>;

export type ActionResult<T = undefined> = { ok: true; data: T } | { ok: false; error: string };

// ---- DTOs ---------------------------------------------------------------------------

export type WebsiteSummaryDto = { title: string; description: string; headings: string[]; fetchedAt: string };

export type OnboardingProfileDto = {
  brandId: string;
  company: string;
  website: string | null;
  valueProp: string;
  icps: Icp[];
  targetIndustries: string[];
  targetRegions: string[];
  websiteSummary: WebsiteSummaryDto | null;
  onboarded: boolean;
};

export type AnalyzeResultDto = { url: string; read: boolean; generatedWith: "ai" | "template" };
export type CompleteResultDto = { campaignId: string; created: boolean; generatedWith: "ai" | "template" | "existing" };
