import { BRAND } from "@/config/brand";
export const SESSION_COOKIE = `${BRAND.key}_session`;
export const SESSION_TTL_DAYS = 30;
export const CSRF_FIELD = "csrf";

export const HEARD_ABOUT_OPTIONS = ["LinkedIn", "Word of mouth", "Google search", "A creator", "Other"] as const;

export const DEMO_ACCOUNTS = {
  brand: { email: `brand@${BRAND.demoDomain}`, label: "Explore as demo brand" },
  creator: { email: `creator@${BRAND.demoDomain}`, label: "Explore as demo creator" },
} as const;

export const ROLE_HOME = { brand: "/brand", creator: "/creator" } as const;
export const ROLE_ONBOARDING = { brand: "/onboarding/brand", creator: "/onboarding/creator" } as const;
