import { prefixedKey } from "@/utils/storage-prefix";

const PENDING_KEY = prefixedKey("oauth_pending_code");

function readStorage(): string | null {
  try {
    return window.sessionStorage.getItem(PENDING_KEY)?.trim() || null;
  } catch {
    return null;
  }
}

function writeStorage(code: string): void {
  try {
    window.sessionStorage.setItem(PENDING_KEY, code);
  } catch {
    /* storage can be blocked */
  }
}

function readCodeFromLocation(): string | null {
  const hash = window.location.hash.startsWith("#")
    ? window.location.hash.slice(1)
    : window.location.hash;
  const fromHash = new URLSearchParams(hash).get("code");
  const fromQuery = new URLSearchParams(window.location.search).get("code");
  return (fromHash ?? fromQuery)?.trim() || null;
}

/**
 * One-time Yandex login code (`#code=`).
 * Stash in sessionStorage so React Strict Mode remount still sees it; strip the URL at once.
 */
export function readAndClearOauthCallbackCode(): string | null {
  if (typeof window === "undefined") return null;

  const fromUrl = readCodeFromLocation();
  if (fromUrl) {
    writeStorage(fromUrl);
    window.history.replaceState(null, "", window.location.pathname);
    return fromUrl;
  }

  return readStorage();
}

export function clearOauthCallbackCode(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(PENDING_KEY);
  } catch {
    /* storage can be blocked */
  }
}
