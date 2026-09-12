import { describe, expect, it } from "vitest";
import { buildTemplateProfile, companyFromTitle, inferIndustries, resolveCompany } from "./profile-template";

const summary = {
  title: "Vercel: Build and deploy the best web experiences",
  description: "Vercel's developer platform lets teams deploy AI apps and frontends.",
  headings: ["Deploy in seconds", "AI Cloud for developers"],
};

describe("companyFromTitle", () => {
  it("takes the brand before the separator", () => {
    expect(companyFromTitle("Vercel: Build and deploy")).toBe("Vercel");
    expect(companyFromTitle("Zune — AI product studio")).toBe("Zune");
    expect(companyFromTitle("Acme & Co | Invoicing")).toBe("Acme & Co");
  });
  it("prefers the segment that names the host", () => {
    expect(companyFromTitle("Agentic Infrastructure - Vercel", "vercel")).toBe("Vercel");
    expect(companyFromTitle("Home | Acme Corp", "acmecorp")).toBe("Acme Corp");
  });
  it("refuses long titles with no separator", () => {
    expect(companyFromTitle("Build and deploy the best web experiences today")).toBeNull();
  });
});

describe("resolveCompany", () => {
  it("keeps a real company name", () => {
    expect(resolveCompany({ summary, company: "Zune", companyIsPlaceholder: false, emailDomain: "zune.dev", url: "https://zune.dev" })).toBe("Zune");
  });
  it("replaces the placeholder with the site title, then the domain", () => {
    expect(resolveCompany({ summary, company: "Gmail", companyIsPlaceholder: true, emailDomain: "gmail.com", url: "https://vercel.com" })).toBe("Vercel");
    expect(resolveCompany({ summary: null, company: "Gmail", companyIsPlaceholder: true, emailDomain: "gmail.com", url: "https://www.acme.io" })).toBe("Acme");
  });
  it("keeps the registered name when the host does not look like a brand", () => {
    expect(resolveCompany({ summary: null, company: "Gmail", companyIsPlaceholder: true, emailDomain: "gmail.com", url: "https://no-such-host-9f3k2.example" })).toBe("Gmail");
  });
});

describe("inferIndustries", () => {
  it("scores keyword hits and fills to at least two", () => {
    const industries = inferIndustries("AI agents and LLM features for developers, deploy with the API");
    expect(industries).toContain("AI");
    expect(industries).toContain("Developer Tools");
    expect(industries.length).toBeGreaterThanOrEqual(2);
    expect(industries.length).toBeLessThanOrEqual(3);
  });
  it("defaults to B2B / SaaS with no text", () => {
    expect(inferIndustries("")).toEqual(["B2B", "SaaS"]);
  });
});

describe("buildTemplateProfile", () => {
  it("writes 4–6 sentences and three ICPs from the fetched text", () => {
    const { profile, industries } = buildTemplateProfile({ summary, company: "Gmail", companyIsPlaceholder: true, emailDomain: "gmail.com", url: "https://vercel.com" });
    expect(profile.company).toBe("Vercel");
    expect(profile.valueProp).toContain("Vercel's developer platform");
    const sentences = profile.valueProp.match(/[.!?](\s|$)/g) ?? [];
    expect(sentences.length).toBeGreaterThanOrEqual(4);
    expect(sentences.length).toBeLessThanOrEqual(6);
    expect(profile.icps).toHaveLength(3);
    expect(industries.length).toBeGreaterThanOrEqual(2);
  });
  it("still produces a draft when nothing was fetched", () => {
    const { profile } = buildTemplateProfile({ summary: null, company: "Acme", companyIsPlaceholder: false, emailDomain: "acme.io", url: "https://acme.io" });
    expect(profile.valueProp).toContain("could not be read");
    expect(profile.icps.every((icp) => icp.description.includes("Acme"))).toBe(true);
  });
});
