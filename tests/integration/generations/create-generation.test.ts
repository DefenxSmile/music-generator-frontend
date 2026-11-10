import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createGeneration } from "@/requests/generations";
import { setAccessToken } from "@/utils/access-token";

describe("createGeneration", () => {
  beforeEach(() => {
    vi.stubEnv("JAVA_API_BASE_URL", "https://api.example.test");
    setAccessToken("access-1");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    setAccessToken(null);
  });

  it("POSTs prompt with Idempotency-Key like Postman", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          id: "gen-1",
          status: "PENDING",
          prompt: "короткая поп-песня про утро",
          caption: null,
          lyrics: null,
          durationSeconds: null,
          vocalLanguage: null,
          instrumental: null,
          errorCode: null,
          audioUrl: null,
          audioUrlExpiresAt: null,
          expiresAt: null,
          createdAt: "2026-11-10T00:00:00Z",
        }),
        { status: 202, headers: { "Content-Type": "application/json" } },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(createGeneration("короткая поп-песня про утро", "idem-1")).resolves.toMatchObject({
      id: "gen-1",
      status: "PENDING",
    });

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.example.test/api/v1/generations");
    expect(init.method).toBe("POST");
    expect(init.body).toBe(JSON.stringify({ prompt: "короткая поп-песня про утро" }));
    const headers = new Headers(init.headers);
    expect(headers.get("Idempotency-Key")).toBe("idem-1");
    expect(headers.get("Authorization")).toBe("Bearer access-1");
  });
});
