import { BRAND } from "@/config/brand";
export const SESSION_COOKIE = `${BRAND.key}_session`;
export const SESSION_TTL_DAYS = 30;
export const CSRF_FIELD = "csrf";

export const HEARD_ABOUT_OPTIONS = ["LinkedIn", "Word of mouth", "Google search", "A creator", "Other"] as const;

export const DEMO_ACCOUNTS = {
  brand: { email: `brand@${BRAND.demoDomain}`, legacyEmail: `brand@${BRAND.legacyDemoDomain}`, label: "Explore as demo brand" },
  creator: { email: `creator@${BRAND.demoDomain}`, legacyEmail: `creator@${BRAND.legacyDemoDomain}`, label: "Explore as demo creator" },
} as const;
export const DEMO_DOMAINS = [BRAND.demoDomain, BRAND.legacyDemoDomain] as const;
export const isDemoEmail = (email: string) => DEMO_DOMAINS.some((d) => email.endsWith(`@${d}`));

export const ROLE_HOME = { brand: "/brand", creator: "/creator" } as const;
export const ROLE_ONBOARDING = { brand: "/onboarding/brand", creator: "/onboarding/creator" } as const;

// The auth pages' media panel (docs/reference/auth-media-spec.md): the spec's
// reef clip and poster, verbatim; our copy in its slots.
export const AUTH_MEDIA = {
  video: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260831_231820_baf1d009-9cc2-4f94-a720-b04a94a8eab4.mp4",
  poster: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260831_224622_4eeb9d43-9e46-4483-9530-1eb4ef4c942d.png&w=1920&q=85",
  line: "Run creator campaigns that drive real business.",
  waterLabel: "2,400 vetted creators",
  reefLabel: "Every click tracked",
} as const;

// naano's role query values on /register → our role sign-up steps.
export const REGISTER_ROLE_PARAM: Record<string, string> = { saas: "/register/brand", brand: "/register/brand", influencer: "/register/creator", creator: "/register/creator" };
