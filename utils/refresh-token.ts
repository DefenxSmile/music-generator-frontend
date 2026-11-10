import { prefixedKey } from "@/utils/storage-prefix";

/**
 * Java now returns `refreshToken` in JSON (see AccessTokenResponse / RefreshRequest).
 * Persist across F5 so `/auth/refresh` can send `{ refreshToken }` in the body.
 * Prefer HttpOnly cookie when the stand supports it again; until then this is required.
 */
const REFRESH_KEY = prefixedKey("refresh_token");

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(REFRESH_KEY);
    return value?.trim() ? value : null;
  } catch {
    return null;
  }
}

export function setRefreshToken(token: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (!token?.trim()) {
      window.localStorage.removeItem(REFRESH_KEY);
      return;
    }
    window.localStorage.setItem(REFRESH_KEY, token.trim());
  } catch {
    /* private mode / quota */
  }
}

export function clearRefreshToken(): void {
  setRefreshToken(null);
}
