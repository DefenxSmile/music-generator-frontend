import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { refreshAccessToken } from "@/requests/refresh-access-token";
import { getAccessToken, setAccessToken } from "@/utils/access-token";
import { clearRefreshToken, getRefreshToken, setRefreshToken } from "@/utils/refresh-token";

describe("refreshAccessToken", () => {
  beforeEach(() => {
    vi.stubEnv("JAVA_API_BASE_URL", "https://api.example.test");
    setAccessToken(null);
    clearRefreshToken();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    setAccessToken(null);
    clearRefreshToken();
  });

  it("coalesces parallel refreshes and posts the stored refresh token", async () => {
    setRefreshToken("r0");
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({ accessToken: "shared", expiresIn: 60, refreshToken: "r1" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    const [a, b] = await Promise.all([refreshAccessToken(), refreshAccessToken()]);
    expect(a).toBe("shared");
    expect(b).toBe("shared");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(JSON.parse(String(init.body))).toEqual({ refreshToken: "r0" });
    expect(getAccessToken()).toBe("shared");
    expect(getRefreshToken()).toBe("r1");
  });

  it("skips the network when no refresh token is stored", async () => {
    setAccessToken("still-here");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    await expect(refreshAccessToken()).resolves.toBe("still-here");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns null and clears tokens on 401", async () => {
    setAccessToken("stale");
    setRefreshToken("r-stale");
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          new Response(JSON.stringify({ errorCode: "UNAUTHORIZED" }), { status: 401 }),
        ),
    );

    await expect(refreshAccessToken()).resolves.toBeNull();
    expect(getAccessToken()).toBeNull();
    expect(getRefreshToken()).toBeNull();
  });
});
