import { afterEach, describe, expect, it } from "vitest";
import { clearRefreshToken, getRefreshToken, setRefreshToken } from "@/utils/refresh-token";

describe("refresh-token storage", () => {
  afterEach(() => {
    clearRefreshToken();
  });

  it("stores and clears the refresh token", () => {
    expect(getRefreshToken()).toBeNull();
    setRefreshToken(" r1 ");
    expect(getRefreshToken()).toBe("r1");
    clearRefreshToken();
    expect(getRefreshToken()).toBeNull();
  });
});
