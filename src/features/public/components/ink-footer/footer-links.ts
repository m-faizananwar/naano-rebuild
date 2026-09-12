import { BRAND } from "@/config/brand";

// Our copy in the spec's slots (docs/reference/ink-footer-spec.md).
export const INK_BLURB = "Creator campaigns that connect, convert, and leave a trace you can measure";
export const INK_CONTACTS = {
  email: BRAND.supportEmail,
  phone: { label: "+92 000 0000000", href: "tel:+920000000000" },
  place: "Islamabad",
};
export const INK_COLUMNS = [
  {
    heading: "Product",
    aria: "Product",
    links: [
      { label: "Marketplace", href: "/brand/creators" },
      { label: "Campaigns", href: "/brand/campaigns" },
      { label: "Brief editor", href: "/brand/campaigns/new" },
      { label: "Results", href: "/brand/results" },
      { label: "Pricing", href: "/pricing" },
      { label: "Benchmarks", href: "/benchmarks" },
    ],
  },
  {
    heading: "Company",
    aria: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "For creators", href: "/for-creators" },
      { label: "For agencies", href: "/for-agencies" },
      { label: "Blog", href: "/case-study" },
      { label: "Book a call", href: "/book-a-call" },
    ],
  },
  {
    heading: "Care & Service",
    aria: "Care and service",
    links: [
      { label: "FAQs", href: "/faq" },
      { label: "Help Center", href: "/faq" },
      { label: "Integrations", href: "/brand/integrations" },
      { label: "Where’s My Booking", href: "/brand/collaborations" },
      { label: "Talk To Us", href: "/book-a-call" },
    ],
  },
] as const;
export const INK_LETTER = "Sign up for early notice on new creators, benchmarks & members-only campaigns.";
export const INK_SOCIALS = ["LinkedIn", "X", "Instagram", "TikTok"] as const;
export const INK_LEGAL = [
  { label: "Privacy Notice", href: "/privacy" },
  { label: "Terms & Policies", href: "/terms" },
  { label: "Cookie Notice", href: "/privacy#cookies" },
] as const;
export const INK_VIDEO = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260901_122529_931c22c8-8d2d-47c0-ad51-b97f56a91e42.mp4";
export const INK_POSTER = "https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/4f690bd1-881a-4192-82f2-d714d34c8fb9.png";
