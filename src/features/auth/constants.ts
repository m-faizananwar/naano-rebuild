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
  // Self-hosted: the spec's reef clip re-encoded to an 8s 1280px loop (~1MB) with its own poster.
  video: "/media/auth.mp4",
  poster: "/media/auth.jpg",
  line: "Run creator campaigns that drive real business.",
  waterLabel: "2,400 vetted creators",
  reefLabel: "Every click tracked",
} as const;

// naano's role query values on /register → our role sign-up steps.
export const REGISTER_ROLE_PARAM: Record<string, string> = { saas: "/register/brand", brand: "/register/brand", influencer: "/register/creator", creator: "/register/creator" };

// Password reset email (Resend). onboarding@resend.dev is Resend's shared
// sender for accounts without a verified domain.
export const RESET_EMAIL_FROM = `${BRAND.wordmark} <onboarding@resend.dev>`;
export const RESET_EMAIL_SUBJECT = `Reset your ${BRAND.wordmark} password`;
