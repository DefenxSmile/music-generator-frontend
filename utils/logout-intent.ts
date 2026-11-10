import { prefixedKey } from "@/utils/storage-prefix";

const KEY = prefixedKey("logged_out");

export function logoutIntentStorageKey(): string {
  return KEY;
}

/**
 * Local intent after logout when Java may not have cleared the refresh cookie
 * (offline / 5xx). Session resume skips refresh until the next successful login.
 */
export function markLoggedOutIntent(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, "1");
  } catch {
    /* storage can be blocked */
  }
}

export function clearLoggedOutIntent(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* storage can be blocked */
  }
}

export function readLoggedOutIntent(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}
