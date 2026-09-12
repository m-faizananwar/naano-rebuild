import { BRAND } from "@/config/brand";

// 1920×1080, 10.04s, 241 frames, all-intra: every frame is a keyframe, which is
// why a scroll scrub can land on an exact frame instantly.
export const HERO_VIDEO_URL = "https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/45567745-d826-44a2-a5ce-7ef670944e60.mp4";
export const HERO_POSTER = "/hero/poster.jpg";
export const HERO_VIDEO_BYTES = 11e6; // approximate size, used when the server sends no content-length

// Each panel owns a slice of scroll as [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd]
// in 0..1 hero progress. The gaps between one panel's fadeOutEnd and the next's
// fadeInStart are deliberate dead zones — video only — so two panels are never
// readable at once.
export const CUES: ReadonlyArray<readonly [number, number, number, number]> = [
  [0.0, 0.0, 0.15, 0.23],
  [0.35, 0.43, 0.57, 0.65],
  [0.77, 0.85, 1.1, 1.2],
];
export const DRIFT = 22; // px of counter-scroll travel per panel
export const SEEK_EASE = 0.115; // easing factor — do not change
export const SEEK_EPSILON = 0.0008;
export const ATTACH_TIMEOUT_MS = 12000;
export const PRELOAD_BAIL_MS = 15000;

export type HeroPanel = { eyebrow: string; h1: string; sub: string; cta: { label: string; href: string } };

export const PANELS: readonly HeroPanel[] = [
  {
    eyebrow: `B2B LinkedIn creator marketplace · ${BRAND.name}`,
    h1: "The creators your buyers already trust.",
    sub: "Find B2B voices whose audience actually contains your buyers, brief them in minutes, track every click back to the post.",
    cta: { label: "Launch a campaign", href: "/register?role=saas" },
  },
  {
    eyebrow: "From brief to live post",
    h1: "Brief in minutes, not weeks.",
    sub: "AI drafts the brief. Creators write in their own voice. You approve. Nothing goes out without your yes.",
    cta: { label: "See how it works", href: "#how-it-works" },
  },
  {
    eyebrow: "Attribution you can audit",
    h1: "Every click, back to the post.",
    sub: "Tracked links, a real pixel, a click log you can export. Every number on the dashboard is a row.",
    cta: { label: "Start free", href: "/register" },
  },
];
