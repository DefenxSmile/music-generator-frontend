import { afterEach, describe, expect, it, vi } from "vitest";
import {
  javaApiBaseUrl,
  javaApiConfigured,
  javaApiOrigin,
  javaApiProxyEnabled,
  javaApiUrl,
} from "@/utils/java-api";

describe("java-api", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("uses absolute origin when proxy is off", () => {
    vi.stubEnv("JAVA_API_BASE_URL", "https://api.example.test/");
    vi.stubEnv("NEXT_PUBLIC_JAVA_API_PROXY", "");
    expect(javaApiOrigin()).toBe("https://api.example.test");
    expect(javaApiProxyEnabled()).toBe(false);
    expect(javaApiBaseUrl()).toBe("https://api.example.test");
    expect(javaApiUrl("/api/v1/auth/refresh")).toBe(
      "https://api.example.test/api/v1/auth/refresh",
    );
    expect(javaApiConfigured()).toBe(true);
  });

  it("uses same-origin paths when proxy is on", () => {
    vi.stubEnv("JAVA_API_BASE_URL", "https://api.example.test");
    vi.stubEnv("NEXT_PUBLIC_JAVA_API_PROXY", "1");
    expect(javaApiOrigin()).toBe("https://api.example.test");
    expect(javaApiProxyEnabled()).toBe(true);
    expect(javaApiBaseUrl()).toBe("");
    expect(javaApiUrl("/api/v1/auth/refresh")).toBe("/api/v1/auth/refresh");
    expect(javaApiConfigured()).toBe(true);
  });

  it("reports missing origin", () => {
    vi.stubEnv("JAVA_API_BASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_JAVA_API_PROXY", "1");
    expect(javaApiConfigured()).toBe(false);
  });
});
