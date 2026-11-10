import { getAccessExpiresAt, getAccessToken } from "@/utils/access-token";

/** Refresh this many ms before access expiry. */
export const PROACTIVE_REFRESH_SKEW_MS = 60_000;
/** Never schedule sooner than this (avoids tight loops on short TTL). */
export const PROACTIVE_REFRESH_MIN_DELAY_MS = 5_000;

type RefreshFn = () => Promise<string | null>;

let timer: ReturnType<typeof setTimeout> | null = null;
let refreshFn: RefreshFn | null = null;

/** Delay until proactive refresh should fire for a given expiry. */
export function proactiveRefreshDelayMs(expiresAtMs: number, nowMs = Date.now()): number {
  return Math.max(PROACTIVE_REFRESH_MIN_DELAY_MS, expiresAtMs - nowMs - PROACTIVE_REFRESH_SKEW_MS);
}

export function cancelProactiveRefresh(): void {
  if (timer !== null) {
    clearTimeout(timer);
    timer = null;
  }
}

/**
 * Bind the shared `refreshAccessToken` (keeps single-flight with 401 retry).
 * Call once from client bootstrap.
 */
export function bindProactiveRefresh(refresh: RefreshFn): void {
  refreshFn = refresh;
}

/** Schedule refresh before `expiresAt`, or cancel when there is no deadline. */
export function syncProactiveRefresh(): void {
  cancelProactiveRefresh();
  if (typeof window === "undefined") return;
  const token = getAccessToken();
  const expiresAt = getAccessExpiresAt();
  if (!token || !expiresAt || !refreshFn) return;

  const delay = proactiveRefreshDelayMs(expiresAt);
  timer = setTimeout(() => {
    timer = null;
    void refreshFn?.().finally(() => {
      syncProactiveRefresh();
    });
  }, delay);
}
