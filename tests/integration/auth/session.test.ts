import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { QueryClient } from "@tanstack/react-query";
import { sessionQueryOptions } from "@/requests/session";
import { setAccessToken } from "@/utils/access-token";
import { clearLoggedOutIntent, markLoggedOutIntent } from "@/utils/logout-intent";
import { clearRefreshToken, setRefreshToken } from "@/utils/refresh-token";

describe("sessionQueryOptions", () => {
  beforeEach(() => {
    vi.stubEnv("JAVA_API_BASE_URL", "https://api.example.test");
    setAccessToken(null);
    clearRefreshToken();
    clearLoggedOutIntent();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    setAccessToken(null);
    clearRefreshToken();
    clearLoggedOutIntent();
  });

  it("skips refresh when logout intent is set", async () => {
    markLoggedOutIntent();
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const client = new QueryClient();
    await expect(client.fetchQuery(sessionQueryOptions())).resolves.toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns an existing access token without calling refresh", async () => {
    setAccessToken("already");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const client = new QueryClient();
    await expect(client.fetchQuery(sessionQueryOptions())).resolves.toBe("already");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("refreshes when there is no access token but a stored refresh token", async () => {
    setRefreshToken("stored-refresh");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            accessToken: "from-refresh",
            expiresIn: 60,
            refreshToken: "rotated",
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        ),
      ),
    );

    const client = new QueryClient();
    await expect(client.fetchQuery(sessionQueryOptions())).resolves.toBe("from-refresh");
  });
});
