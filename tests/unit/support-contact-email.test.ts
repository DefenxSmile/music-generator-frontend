import { afterEach, describe, expect, it, vi } from "vitest";

describe("SUPPORT_CONTACT_EMAIL", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("reads NEXT_PUBLIC_LEGAL_CONTACT_EMAIL", async () => {
    vi.stubEnv("NEXT_PUBLIC_LEGAL_CONTACT_EMAIL", " help@example.com ");
    const { SUPPORT_CONTACT_EMAIL } = await import("@/utils/support");
    expect(SUPPORT_CONTACT_EMAIL).toBe("help@example.com");
  });

  it("is empty when unset", async () => {
    vi.stubEnv("NEXT_PUBLIC_LEGAL_CONTACT_EMAIL", "");
    const { SUPPORT_CONTACT_EMAIL } = await import("@/utils/support");
    expect(SUPPORT_CONTACT_EMAIL).toBe("");
  });
});
