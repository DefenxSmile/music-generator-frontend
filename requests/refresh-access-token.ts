import { getAccessToken, setAccessToken } from "@/utils/access-token";
import { readAccessTokenResponse } from "@/utils/access-token-response";
import { javaApiConfigured, javaApiUrl } from "@/utils/java-api";
import { syncProactiveRefresh } from "@/utils/proactive-refresh";
import { clearRefreshToken, getRefreshToken, setRefreshToken } from "@/utils/refresh-token";

/** Fail open so session loading / qualify-hold cannot stick forever. */
export const REFRESH_TIMEOUT_MS = 12_000;

let refreshInFlight: Promise<string | null> | null = null;

/**
 * Apply refresh result without wiping an access token issued while refresh was in flight
 * (OAuth callback can finish during a cookie-less resume).
 */
export function settleRefresh(
  previous: string | null,
  next: {
    accessToken: string;
    expiresIn: number | null;
    refreshToken?: string | null;
  } | null,
): string | null {
  const current = getAccessToken();
  if (previous === null && current) return current;
  if (next) {
    if (previous === null && current && current !== next.accessToken) return current;
    setAccessToken(next.accessToken, next.expiresIn);
    if (next.refreshToken) setRefreshToken(next.refreshToken);
    syncProactiveRefresh();
    return next.accessToken;
  }
  if (current === previous) {
    setAccessToken(null);
    clearRefreshToken();
    syncProactiveRefresh();
  }
  return null;
}

/**
 * Resume or rotate access via stored refresh token (JSON body).
 * Single-flight: Java invalidates the previous refresh on each call.
 */
export function refreshAccessToken(): Promise<string | null> {
  if (!refreshInFlight) {
    refreshInFlight = performRefresh().finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}

async function performRefresh(): Promise<string | null> {
  if (!javaApiConfigured()) {
    setAccessToken(null);
    clearRefreshToken();
    syncProactiveRefresh();
    return null;
  }

  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    // No stored refresh → cannot resume; keep any in-memory access as-is.
    return getAccessToken();
  }

  const previous = getAccessToken();
  try {
    const response = await fetch(javaApiUrl("/api/v1/auth/refresh"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(REFRESH_TIMEOUT_MS),
      body: JSON.stringify({ refreshToken }),
    });
    if (!response.ok) return settleRefresh(previous, null);
    const body = (await response.json()) as unknown;
    return settleRefresh(previous, readAccessTokenResponse(body));
  } catch {
    return settleRefresh(previous, null);
  }
}
