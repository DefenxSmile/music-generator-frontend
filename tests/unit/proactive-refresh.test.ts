import { describe, expect, it } from "vitest";
import {
  PROACTIVE_REFRESH_MIN_DELAY_MS,
  PROACTIVE_REFRESH_SKEW_MS,
  proactiveRefreshDelayMs,
} from "@/utils/proactive-refresh";

describe("proactiveRefreshDelayMs", () => {
  it("schedules skew before expiry", () => {
    const now = 1_000_000;
    const expiresAt = now + 15 * 60_000;
    expect(proactiveRefreshDelayMs(expiresAt, now)).toBe(15 * 60_000 - PROACTIVE_REFRESH_SKEW_MS);
  });

  it("never schedules sooner than the minimum delay", () => {
    const now = 1_000_000;
    expect(proactiveRefreshDelayMs(now + 1_000, now)).toBe(PROACTIVE_REFRESH_MIN_DELAY_MS);
  });
});
