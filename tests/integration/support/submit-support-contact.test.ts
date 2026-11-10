import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { submitSupportContact } from "@/requests/support";

describe("submitSupportContact", () => {
  beforeEach(() => {
    vi.stubEnv("JAVA_API_BASE_URL", "https://api.example.test");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("rejects when JAVA_API_BASE_URL is missing", async () => {
    vi.stubEnv("JAVA_API_BASE_URL", "");
    await expect(
      submitSupportContact({ email: "a@b.c", message: "hi", source: "app" }),
    ).resolves.toMatchObject({ ok: false, status: 0 });
  });

  it("POSTs to Java support contact", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      submitSupportContact({
        email: "user@example.com",
        message: "Нужна помощь",
        source: "app",
        pageUrl: "/create",
      }),
    ).resolves.toEqual({ ok: true });

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.example.test/api/v1/support/contact");
    expect(init.method).toBe("POST");
    expect(JSON.parse(String(init.body))).toMatchObject({
      email: "user@example.com",
      message: "Нужна помощь",
      source: "app",
      pageUrl: "/create",
    });
  });

  it("maps Java error message", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            errorCode: "SUPPORT_NOT_CONFIGURED",
            message: "Канал поддержки не настроен.",
          }),
          {
            status: 503,
            headers: { "Content-Type": "application/json" },
          },
        ),
      ),
    );

    await expect(
      submitSupportContact({ email: "user@example.com", message: "hi", source: "landing" }),
    ).resolves.toEqual({
      ok: false,
      status: 503,
      message: "Канал поддержки не настроен.",
    });
  });
});
