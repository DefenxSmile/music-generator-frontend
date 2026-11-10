import { fetchJson } from "@/requests/fetch-json";
import type { AccessTokenResponse } from "@/types/auth";
import { setAccessToken } from "@/utils/access-token";
import { readAccessTokenResponse } from "@/utils/access-token-response";
import { clearLoggedOutIntent, markLoggedOutIntent } from "@/utils/logout-intent";
import { syncProactiveRefresh } from "@/utils/proactive-refresh";
import { broadcastSessionLogout } from "@/utils/session-broadcast";

/** Exchange `#code=` for access in memory; Java sets HttpOnly refresh cookie on this response. */
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
  syncProactiveRefresh();
  return parsed.accessToken;
}

/**
 * Best-effort Java logout, then always drop local access.
 * Marks logout intent so a leftover refresh cookie cannot silently restore the session.
 */
export async function logoutAccount(): Promise<void> {
  try {
    await fetchJson<void>(
      "/api/v1/auth/logout",
      { method: "POST" },
      { retryOnUnauthorized: false },
    );
  } finally {
    markLoggedOutIntent();
    setAccessToken(null);
    syncProactiveRefresh();
    broadcastSessionLogout();
  }
}

export { refreshAccessToken } from "@/requests/refresh-access-token";
