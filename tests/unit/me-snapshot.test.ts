import { afterEach, describe, expect, it } from "vitest";
import { clearMeSnapshot, readMeSnapshot, writeMeSnapshot } from "@/utils/me-snapshot";

describe("me-snapshot", () => {
  afterEach(() => {
    clearMeSnapshot();
  });

  it("round-trips a valid snapshot", () => {
    writeMeSnapshot({
      id: "u1",
      email: "a@b.c",
      emailVerified: true,
      balance: 3,
      createdAt: "2026-01-01T00:00:00Z",
    });
    expect(readMeSnapshot()).toEqual({
      id: "u1",
      email: "a@b.c",
      emailVerified: true,
      balance: 3,
      createdAt: "2026-01-01T00:00:00Z",
    });
  });

  it("rejects corrupt payload", () => {
    window.sessionStorage.setItem("lp_me_snapshot", '{"email":"x"}');
    expect(readMeSnapshot()).toBeNull();
  });
});
