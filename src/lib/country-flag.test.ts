import { describe, expect, it } from "vitest";
import { countryFlag, countryName } from "./country-flag";

describe("countryFlag", () => {
  it("maps ISO codes to regional indicator pairs", () => {
    expect(countryFlag("FR")).toBe("🇫🇷");
    expect(countryFlag("pk")).toBe("🇵🇰");
  });
  it("treats the seed's UK as GB", () => {
    expect(countryFlag("UK")).toBe("🇬🇧");
    expect(countryName("UK")).toBe("United Kingdom");
  });
  it("returns nothing for junk", () => {
    expect(countryFlag("Europe")).toBe("");
  });
});
