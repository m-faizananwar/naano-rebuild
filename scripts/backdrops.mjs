// Derives the landing's hero assets from the CDN clip once, at dev time (not at
// runtime): public/backdrops/hero-still.jpg (the frame at t=2s, ~1600px wide,
// quality ~80, the card sections' backdrop) and public/hero/hero-scrub.mp4 (the
// clip re-encoded all-intra at 1600px, attached on mount so the scrub works
// from the first scroll). Requires ffmpeg. Run: node scripts/backdrops.mjs
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";

const HERO_VIDEO_URL = "https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/45567745-d826-44a2-a5ce-7ef670944e60.mp4";
mkdirSync("public/backdrops", { recursive: true });
execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-ss", "2", "-i", HERO_VIDEO_URL, "-frames:v", "1", "-vf", "scale=1600:-2", "-q:v", "3", "public/backdrops/hero-still.jpg"], { stdio: "inherit" });
console.log("public/backdrops/hero-still.jpg");
execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-i", HERO_VIDEO_URL, "-an", "-c:v", "libx264", "-preset", "fast", "-crf", "20", "-g", "1", "-pix_fmt", "yuv420p", "-vf", "scale=1600:-2", "-movflags", "+faststart", "public/hero/hero-scrub.mp4"], { stdio: "inherit" });
console.log("public/hero/hero-scrub.mp4");
