import { BRAND } from "@/config/brand";

// 1920×1080, 10.04s, 241 frames, all-intra: every frame is a keyframe, which is
// why a scroll scrub can land on an exact frame instantly.
export const HERO_VIDEO_URL = "https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/45567745-d826-44a2-a5ce-7ef670944e60.mp4";
export const HERO_POSTER = "/hero/poster.jpg";
// The same clip re-encoded all-intra at 1600px (scripts/backdrops.mjs), served
// from public/ with long cache headers: attached on mount so seeking works
// from the first scroll while the CDN blob preloads behind it.
export const HERO_LOCAL_URL = "/hero/hero-scrub.mp4";

// Each panel owns a slice of scroll as [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd]
// in 0..1 hero progress. The gaps between one panel's fadeOutEnd and the next's
// fadeInStart are deliberate dead zones — video only — so two panels are never
// readable at once.
// Retimed for the landing's shorter 260vh track (the standalone keeps the spec's).
export const CUES: ReadonlyArray<readonly [number, number, number, number]> = [
  [0.0, 0.0, 0.18, 0.26],
  [0.36, 0.44, 0.58, 0.66],
  [0.76, 0.84, 1.1, 1.2],
];
export const DRIFT = 22; // px of counter-scroll travel per panel
// Landing easing: quicker than the standalone's 0.115 so the scrub keeps up with a
// scroll, and it snaps when the remaining gap is under 4ms of video.
export const SEEK_EASE = 0.24;
export const SEEK_SNAP_S = 0.004;
export const SEEK_RELEASE_MS = 120;
export const SWAP_IDLE_MS = 300;
// the CDN blob download waits until this much of the local clip is buffered
export const LOCAL_BUFFERED_FRACTION = 0.98;
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
