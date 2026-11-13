import { describe, expect, it } from "vitest";
import { supportNudgeAllowedOnPath } from "@/hooks/use-support-proactive-nudge";

describe("supportNudgeAllowedOnPath", () => {
  it("hides the nudge on release so it does not cover the draft grid", () => {
    expect(supportNudgeAllowedOnPath("/release")).toBe(false);
    expect(supportNudgeAllowedOnPath("/release?x=1")).toBe(false);
  });

  it("keeps the nudge on create and home", () => {
    expect(supportNudgeAllowedOnPath("/")).toBe(true);
    expect(supportNudgeAllowedOnPath("/create")).toBe(true);
  });
});
