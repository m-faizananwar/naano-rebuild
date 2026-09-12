import { describe, expect, it } from "vitest";
import { websiteSchema } from "./schemas";

describe("websiteSchema", () => {
  it("normalises a bare domain to https", () => {
    expect(websiteSchema.parse({ url: " yourcompany.com " }).url).toBe("https://yourcompany.com");
    expect(websiteSchema.parse({ url: "http://acme.io/about" }).url).toBe("http://acme.io/about");
  });
  it("refuses other schemes and non-urls", () => {
    expect(websiteSchema.safeParse({ url: "ftp://example.com" }).success).toBe(false);
    expect(websiteSchema.safeParse({ url: "javascript:alert(1)" }).success).toBe(false);
    expect(websiteSchema.safeParse({ url: "not a url" }).success).toBe(false);
    expect(websiteSchema.safeParse({ url: "" }).success).toBe(false);
  });
});
