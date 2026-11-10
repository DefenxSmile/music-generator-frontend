import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/requests/api-error";
import { fetchJson } from "@/requests/fetch-json";
import { setAccessToken } from "@/utils/access-token";

describe("fetchJson", () => {
  beforeEach(() => {
    vi.stubEnv("JAVA_API_BASE_URL", "https://api.example.test");
    setAccessToken("access-1");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    setAccessToken(null);
  });

  it("retries once after a successful refresh on 401", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ errorCode: "UNAUTHORIZED" }), { status: 401 }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ accessToken: "access-2", expiresIn: 60 }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ id: "me-1" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      );
    vi.stubGlobal("fetch", fetchMock);

    await expect(fetchJson<{ id: string }>("/api/v1/me")).resolves.toEqual({ id: "me-1" });
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("throws ApiError when the API base is missing", async () => {
    vi.stubEnv("JAVA_API_BASE_URL", "");
    await expect(fetchJson("/api/v1/me")).rejects.toBeInstanceOf(ApiError);
  });
});
