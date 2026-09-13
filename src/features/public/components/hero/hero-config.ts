import { BRAND } from "@/config/brand";

// The hero clip, re-encoded once (scripts/backdrops.mjs) at 1280px / 24fps /
// crf 30, all-intra so every frame is a keyframe and the scrub lands on exact
// frames; ~2MB, served from public/media with long cache headers. The CDN
// original is not fetched at runtime any more.
export const HERO_POSTER = "/hero/poster.jpg";
export const HERO_LOCAL_URL = "/media/hero-scrub.mp4";

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
export const ATTACH_TIMEOUT_MS = 12000;

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
