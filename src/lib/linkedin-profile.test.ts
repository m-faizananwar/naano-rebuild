import { describe, expect, it } from "vitest";
import { HEADLINE_TEMPLATES, deriveLinkedinProfile, hashSlug, nameFromSlug, parseLinkedinSlug } from "./linkedin-profile";

describe("parseLinkedinSlug", () => {
  it("accepts the usual public profile URL shapes", () => {
    expect(parseLinkedinSlug("https://www.linkedin.com/in/jane-doe-1a2b")).toBe("jane-doe-1a2b");
    expect(parseLinkedinSlug("linkedin.com/in/jane-doe/")).toBe("jane-doe");
    expect(parseLinkedinSlug("  https://fr.linkedin.com/in/jean.dupont?trk=x ")).toBe("jean.dupont");
  });
  it("rejects anything that is not a /in/ profile", () => {
    expect(parseLinkedinSlug("https://www.linkedin.com/company/naano")).toBeNull();
    expect(parseLinkedinSlug("https://example.com/in/jane")).toBeNull();
    expect(parseLinkedinSlug("")).toBeNull();
  });
});

describe("nameFromSlug", () => {
  it("title-cases the words and drops the trailing hash", () => {
    expect(nameFromSlug("jane-doe-1a2b")).toBe("Jane Doe");
    expect(nameFromSlug("muhammad-faizan-anwar-67a480")).toBe("Muhammad Faizan Anwar");
    expect(nameFromSlug("jean.dupont")).toBe("Jean Dupont");
  });
  it("keeps something when every word carries a digit", () => {
    expect(nameFromSlug("dev42")).toBe("Dev42");
  });
});

describe("deriveLinkedinProfile", () => {
  it("is deterministic: same URL, same card", () => {
    const a = deriveLinkedinProfile("https://www.linkedin.com/in/jane-doe-1a2b");
    const b = deriveLinkedinProfile("https://linkedin.com/in/jane-doe-1a2b/");
    expect(a).toEqual(b);
    expect(a?.name).toBe("Jane Doe");
    expect(a?.headline).toBeTruthy();
  });

  it("returns null for a non-profile URL", () => {
    expect(deriveLinkedinProfile("https://www.linkedin.com/feed/")).toBeNull();
  });

  it("spreads followers 1k–120k with most under 10k, and engagement consistent with size", () => {
    const profiles = Array.from({ length: 400 }, (_, i) => deriveLinkedinProfile(`https://linkedin.com/in/creator-${i}-ab${i}c`));
    let under10k = 0;
    for (const p of profiles) {
      expect(p).not.toBeNull();
      if (!p) continue;
      expect(p.followers).toBeGreaterThanOrEqual(1_000);
      expect(p.followers).toBeLessThanOrEqual(120_000);
      if (p.followers < 10_000) under10k += 1;
      expect(p.medianViews).toBeGreaterThan(0);
      expect(p.medianViews).toBeLessThan(p.followers);
      expect(p.engagementRate).toBeGreaterThan(0.01);
      expect(p.engagementRate).toBeLessThan(0.08);
      if (p.followers > 30_000) expect(p.engagementRate).toBeLessThan(0.035);
      expect(HEADLINE_TEMPLATES).toContain(p.headline);
    }
    expect(under10k / profiles.length).toBeGreaterThan(0.5);
  });

  it("hashes slugs case-insensitively", () => {
    expect(hashSlug("Jane-Doe")).toBe(hashSlug("jane-doe"));
    expect(hashSlug("jane-doe")).not.toBe(hashSlug("john-doe"));
  });
});
