import type { GazeFooterCopy } from "./GazeFooter";

// The spec's copy, verbatim (curly apostrophes, asterisks, line breaks).
export const STUDIO_COPY: GazeFooterCopy = {
  leftBadge: "have a fresh idea?",
  leftHeadline: ["imagination", "meets craft"],
  labels: [{ label: "Made" }, { label: "Story" }, { label: "In the lab" }, { label: "Say hey" }],
  rightBadge: "say hey",
  rightHeadline: ["let’s team up!", "bring us your idea*"],
  note: "*good things start with one spark. let’s make yours.",
};

// Ours, in the same slots with the same character budgets so the vw layout holds.
export const LANDING_COPY: GazeFooterCopy = {
  leftBadge: "got a campaign idea?",
  leftHeadline: ["creators", "meet buyers"],
  labels: [
    { label: "Creators", href: "/brand/creators" },
    { label: "Briefs", href: "/brand/campaigns" },
    { label: "Benchmarks", href: "/benchmarks" },
    { label: "Say hey", href: "/book-a-call" },
  ],
  rightBadge: "say hey",
  rightHeadline: ["let’s team up!", "bring us your brief*"],
  note: "*good campaigns start with one post. let’s make yours.",
};
