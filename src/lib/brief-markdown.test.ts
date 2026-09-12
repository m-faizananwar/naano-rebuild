import { describe, expect, it } from "vitest";
import { type BriefDoc, briefToAiPrompt, briefToMarkdown, primaryCta } from "./brief-markdown";

const doc: BriefDoc = {
  campaignName: "Main campaign",
  campaignDescription: "Cold-email infrastructure, done for you.",
  brandCompany: "Premium Inboxes",
  brandWebsite: "https://premiuminboxes.com",
  valueProp: "Outbound teams lose campaigns to burned inboxes.",
  icpTitles: ["Cold-email agencies", "SDR teams"],
  whatToTell: "Drive signups.",
  targetIndustries: ["B2B", "Sales"],
  targetGeos: ["Europe", "North America"],
  tone: "Operator-to-operator.",
  do: ["Lead with a real pain."],
  avoid: ["Do not promise reply rates."],
  links: ["https://premiuminboxes.com/pricing"],
  angles: [{ angle: "New angle", hook: "Your inbox burned.", direction: "Practical.", example: "Example post." }],
  trackedUrl: null,
  postDeadline: "2026-09-18T00:00:00.000Z",
};

describe("briefToMarkdown", () => {
  it("renders every section in the drawer's order", () => {
    const md = briefToMarkdown(doc);
    const order = ["# Main campaign", "## Campaign objectives", "## Target audience", "## Call to action", "## Content angles · 1", "### 1. New angle"];
    const positions = order.map((h) => md.indexOf(h));
    expect(positions.every((p) => p >= 0)).toBe(true);
    expect([...positions].sort((a, b) => a - b)).toEqual(positions);
    expect(md).toContain("Post deadline: 2026-09-18");
    expect(md).toContain("- Lead with a real pain.");
  });

  it("prefers the tracked link for the primary CTA", () => {
    expect(primaryCta(doc)).toContain("https://premiuminboxes.com/pricing");
    expect(primaryCta({ ...doc, trackedUrl: "https://naano.test/r/abc" })).toBe(
      "Send readers to https://naano.test/r/abc (your tracked Naano link)",
    );
  });

  it("wraps the brief in an AI prompt", () => {
    const prompt = briefToAiPrompt(doc);
    expect(prompt.startsWith("You are helping me write a sponsored LinkedIn post.")).toBe(true);
    expect(prompt).toContain("--- BRIEF ---");
    expect(prompt).toContain("## Content angles");
  });
});
