// Extracts the landing's card-section backdrop from the hero video once, at
// build/dev time (not at runtime): the frame at t=2s, ~1600px wide, quality
// ~80. Requires ffmpeg. Run: node scripts/backdrops.mjs
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";

const HERO_VIDEO_URL = "https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/45567745-d826-44a2-a5ce-7ef670944e60.mp4";
mkdirSync("public/backdrops", { recursive: true });
execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-ss", "2", "-i", HERO_VIDEO_URL, "-frames:v", "1", "-vf", "scale=1600:-2", "-q:v", "3", "public/backdrops/hero-still.jpg"], { stdio: "inherit" });
console.log("public/backdrops/hero-still.jpg");
