import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { QueryClient } from "@tanstack/react-query";
import { sessionQueryOptions } from "@/requests/session";
import { setAccessToken } from "@/utils/access-token";
import { clearLoggedOutIntent, markLoggedOutIntent } from "@/utils/logout-intent";

describe("sessionQueryOptions", () => {
  beforeEach(() => {
    vi.stubEnv("JAVA_API_BASE_URL", "https://api.example.test");
    setAccessToken(null);
    clearLoggedOutIntent();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    setAccessToken(null);
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

  it("refreshes when there is no access token", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ accessToken: "from-cookie", expiresIn: 60 }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );

    const client = new QueryClient();
    await expect(client.fetchQuery(sessionQueryOptions())).resolves.toBe("from-cookie");
  });
});
