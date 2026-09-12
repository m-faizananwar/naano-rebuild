import { describe, expect, it } from "vitest";
import { parseVoiceCommand } from "./voice-grammar";

describe("parseVoiceCommand", () => {
  it("parses the reference commands", () => {
    expect(parseVoiceCommand("find creators in fintech under 500 euros")).toEqual({ tool: "searchCreators", industry: "Fintech", country: undefined, maxPriceEuros: 500, minPriceEuros: undefined });
    expect(parseVoiceCommand("open the zune campaign")).toEqual({ tool: "openCampaign", name: "zune" });
    expect(parseVoiceCommand("approve the draft from josiah")).toEqual({ tool: "approveDraft", creatorName: "Josiah" });
    expect(parseVoiceCommand("book oceane for one post")).toEqual({ tool: "bookCreator", name: "Oceane", posts: 1 });
    expect(parseVoiceCommand("show me results")).toEqual({ tool: "showResults", campaign: undefined });
    expect(parseVoiceCommand("go to billing")).toEqual({ tool: "navigate", route: "billing" });
    expect(parseVoiceCommand("top up 2500")).toEqual({ tool: "topUp", amountEuros: 2500 });
  });
  it("handles variants and the creator side", () => {
    expect(parseVoiceCommand("Top up my wallet by 2,500 €.")).toEqual({ tool: "topUp", amountEuros: 2500 });
    expect(parseVoiceCommand("book Océane Martin for 3 posts")).toEqual({ tool: "bookCreator", name: "Océane Martin", posts: 3 });
    expect(parseVoiceCommand("request changes on the draft from Josiah: shorten the intro")).toEqual({ tool: "requestChanges", creatorName: "Josiah", note: "shorten the intro" });
    expect(parseVoiceCommand("apply to the Premium Inboxes campaign")).toEqual({ tool: "applyToCampaign", name: "Premium Inboxes" });
    expect(parseVoiceCommand("submit my draft: Sponsored, and I'd say this anyway")).toEqual({ tool: "submitDraft", text: "Sponsored, and I'd say this anyway" });
    expect(parseVoiceCommand("find creators in France over 200 euros")).toMatchObject({ tool: "searchCreators", country: "France", minPriceEuros: 200 });
    expect(parseVoiceCommand("open my card")).toEqual({ tool: "navigate", route: "card" });
  });
  it("returns unknown for anything else", () => {
    expect(parseVoiceCommand("what's the weather").tool).toBe("unknown");
  });
});
