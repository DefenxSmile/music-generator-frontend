import { afterEach, describe, expect, it } from "vitest";
import { settleRefresh } from "@/requests/refresh-access-token";
import { getAccessExpiresAt, getAccessToken, setAccessToken } from "@/utils/access-token";
import { clearRefreshToken, getRefreshToken, setRefreshToken } from "@/utils/refresh-token";

describe("settleRefresh", () => {
  afterEach(() => {
    setAccessToken(null);
    clearRefreshToken();
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

  it("stores a successful access token, expiresIn and rotated refresh", () => {
    expect(
      settleRefresh(null, {
        accessToken: "fresh",
        expiresIn: 120,
        refreshToken: "next-refresh",
      }),
    ).toBe("fresh");
    expect(getAccessToken()).toBe("fresh");
    expect(getAccessExpiresAt()).toBeGreaterThan(Date.now());
    expect(getRefreshToken()).toBe("next-refresh");
  });

  it("clears stored refresh when the failed refresh owned the access token", () => {
    setAccessToken("old");
    setRefreshToken("r-old");
    expect(settleRefresh("old", null)).toBeNull();
    expect(getRefreshToken()).toBeNull();
  });
});
