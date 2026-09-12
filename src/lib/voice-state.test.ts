import { describe, expect, it } from "vitest";
import { INITIAL_VOICE_STATE, type VoiceEvent, voiceReducer } from "./voice-state";

function run(events: VoiceEvent[]) {
  return events.reduce(voiceReducer, INITIAL_VOICE_STATE);
}

describe("voiceReducer", () => {
  it("walks listening → thinking → speaking → idle for a navigation", () => {
    const s1 = run([{ type: "start" }, { type: "partial", text: "go to" }]);
    expect(s1).toMatchObject({ status: "listening", transcript: "go to" });
    const s2 = voiceReducer(s1, { type: "final", text: "go to billing" });
    expect(s2.status).toBe("thinking");
    const s3 = voiceReducer(s2, { type: "response", speech: "Opening billing.", ok: true });
    expect(s3).toMatchObject({ status: "speaking", speech: "Opening billing." });
    expect(voiceReducer(s3, { type: "spoken" })).toMatchObject({ status: "idle", pending: null });
  });
  it("waits in confirming after a gated question and clears on the answer", () => {
    const pending = { tool: "topUp", amountEuros: 2500 };
    const asked = run([{ type: "start" }, { type: "final", text: "top up 2500" }, { type: "response", speech: "Top up €2,500? Say yes to confirm.", pending, ok: true }, { type: "spoken" }]);
    expect(asked).toMatchObject({ status: "confirming", pending });
    const answered = voiceReducer(voiceReducer(asked, { type: "final", text: "yes" }), { type: "response", speech: "Done — €2,500 credited.", ok: true });
    expect(answered.pending).toBeNull();
    expect(voiceReducer(answered, { type: "spoken" }).status).toBe("idle");
  });
  it("ignores partial text unless listening or confirming, and stop resets", () => {
    expect(voiceReducer(INITIAL_VOICE_STATE, { type: "partial", text: "x" }).transcript).toBe("");
    expect(run([{ type: "start" }, { type: "stop" }])).toMatchObject({ status: "idle", transcript: "" });
    expect(run([{ type: "start" }, { type: "fail", message: "mic denied" }])).toMatchObject({ status: "error", error: "mic denied" });
  });
});
