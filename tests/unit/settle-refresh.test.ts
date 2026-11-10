import { afterEach, describe, expect, it } from "vitest";
import { settleRefresh } from "@/requests/refresh-access-token";
import { getAccessExpiresAt, getAccessToken, setAccessToken } from "@/utils/access-token";

describe("settleRefresh", () => {
  afterEach(() => {
    setAccessToken(null);
  });

  it("keeps an OAuth token that appeared while a cookie-less refresh failed", () => {
    expect(settleRefresh(null, null)).toBeNull();
    setAccessToken("oauth-token");
    expect(settleRefresh(null, null)).toBe("oauth-token");
    expect(getAccessToken()).toBe("oauth-token");
  });

  it("clears only when the token did not change during a failed refresh", () => {
    setAccessToken("old");
    expect(settleRefresh("old", null)).toBeNull();
    expect(getAccessToken()).toBeNull();
  });

  it("stores a successful refresh token and expiresIn", () => {
    expect(settleRefresh(null, { accessToken: "fresh", expiresIn: 120 })).toBe("fresh");
    expect(getAccessToken()).toBe("fresh");
    expect(getAccessExpiresAt()).toBeGreaterThan(Date.now());
  });
});
