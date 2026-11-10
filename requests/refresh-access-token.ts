import { getAccessToken, setAccessToken } from "@/utils/access-token";
import { readAccessTokenResponse } from "@/utils/access-token-response";
import { javaApiBaseUrl } from "@/utils/java-api";
import { syncProactiveRefresh } from "@/utils/proactive-refresh";

/** Fail open so session loading / qualify-hold cannot stick forever. */
export const REFRESH_TIMEOUT_MS = 12_000;

let refreshInFlight: Promise<string | null> | null = null;

/**
 * Apply refresh result without wiping an access token issued while refresh was in flight
 * (OAuth callback can finish during a cookie-less resume).
 */
export function settleRefresh(
  previous: string | null,
  next: { accessToken: string; expiresIn: number | null } | null,
): string | null {
  const current = getAccessToken();
  if (previous === null && current) return current;
  if (next) {
    if (previous === null && current && current !== next.accessToken) return current;
    setAccessToken(next.accessToken, next.expiresIn);
    syncProactiveRefresh();
    return next.accessToken;
  }
  if (current === previous) {
    setAccessToken(null);
    syncProactiveRefresh();
  }
  return null;
}

/**
 * Resume or rotate access via Java refresh cookie.
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
  const base = javaApiBaseUrl();
  if (!base) {
    setAccessToken(null);
    syncProactiveRefresh();
    return null;
  }

  const previous = getAccessToken();
  try {
    const response = await fetch(`${base}/api/v1/auth/refresh`, {
      method: "POST",
      cache: "no-store",
      signal: AbortSignal.timeout(REFRESH_TIMEOUT_MS),
    });
    if (!response.ok) return settleRefresh(previous, null);
    const body = (await response.json()) as unknown;
    return settleRefresh(previous, readAccessTokenResponse(body));
  } catch {
    return settleRefresh(previous, null);
  }
}
