import { z } from "zod";
import { INDUSTRIES, REGIONS } from "./constants";

export const brandProfileSchema = z.object({
  company: z.string().trim().min(1, "Company name is required").max(120),
  website: z.string().trim().url("Enter a full URL, including https://").max(200).or(z.literal("")),
  valueProp: z.string().trim().max(2000),
});
export type BrandProfileInput = z.infer<typeof brandProfileSchema>;

export const brandAudienceSchema = z.object({
  targetIndustries: z.array(z.enum(INDUSTRIES)).max(INDUSTRIES.length),
  targetRegions: z.array(z.enum(REGIONS)).max(REGIONS.length),
});
export type BrandAudienceInput = z.infer<typeof brandAudienceSchema>;

export const creatorProfileSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  headline: z.string().trim().max(200),
  linkedinUrl: z.string().trim().url().max(200).or(z.literal("")),
  industries: z.array(z.enum(INDUSTRIES)).max(3, "Pick up to 3 industries"),
  priceCents: z.number().int().min(2000, "Minimum €20 per post").max(150000, "Platform limit is €1,500 per post"),
});
export type CreatorProfileInput = z.infer<typeof creatorProfileSchema>;

export type ActionResult<T = undefined> = { ok: true; data: T } | { ok: false; error: string };
