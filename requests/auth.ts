import { fetchJson } from "@/requests/fetch-json";
import type { AccessTokenResponse } from "@/types/auth";
import { setAccessToken } from "@/utils/access-token";
import { readAccessTokenResponse } from "@/utils/access-token-response";
import { clearLoggedOutIntent, markLoggedOutIntent } from "@/utils/logout-intent";
import { syncProactiveRefresh } from "@/utils/proactive-refresh";
import { clearMeSnapshot } from "@/utils/me-snapshot";
import { clearRefreshToken, getRefreshToken, setRefreshToken } from "@/utils/refresh-token";
import { broadcastSessionLogout } from "@/utils/session-broadcast";

/** Exchange `#code=` for access (+ refresh in JSON body on the current stand). */
export async function exchangeOauthCode(code: string): Promise<string> {
  const body = await fetchJson<AccessTokenResponse>(
    "/api/v1/auth/oauth/token",
    { method: "POST", body: JSON.stringify({ code }) },
    { retryOnUnauthorized: false },
  );
  const parsed = readAccessTokenResponse(body);
  if (!parsed) throw new Error("Нет accessToken");
  clearLoggedOutIntent();
  setAccessToken(parsed.accessToken, parsed.expiresIn);
  if (parsed.refreshToken) setRefreshToken(parsed.refreshToken);
  syncProactiveRefresh();
  return parsed.accessToken;
}

/**
 * Best-effort Java logout, then always drop local access + refresh.
 */
export async function logoutAccount(): Promise<void> {
  const refreshToken = getRefreshToken();
  try {
    await fetchJson<void>(
      "/api/v1/auth/logout",
      {
        method: "POST",
        body: refreshToken ? JSON.stringify({ refreshToken }) : undefined,
      },
      { retryOnUnauthorized: false },
    );
  } finally {
    markLoggedOutIntent();
    setAccessToken(null);
    clearRefreshToken();
    clearMeSnapshot();
    syncProactiveRefresh();
    broadcastSessionLogout();
  }
}

export { refreshAccessToken } from "@/requests/refresh-access-token";
