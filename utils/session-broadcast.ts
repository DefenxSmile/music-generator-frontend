import { logoutIntentStorageKey, readLoggedOutIntent } from "@/utils/logout-intent";
import { prefixedKey } from "@/utils/storage-prefix";

const CHANNEL = "lp_session";
const EPOCH_KEY = prefixedKey("session_epoch");

type SessionMessage = { type: "logout" };

/**
 * Notify other tabs that this browser logged out.
 * Uses `storage` (other tabs) + BroadcastChannel (faster same-origin).
 * Caller must already have cleared the local access token / marked logout intent.
 */
export function broadcastSessionLogout(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(EPOCH_KEY, String(Date.now()));
  } catch {
    /* storage can be blocked */
  }
  try {
    const channel = new BroadcastChannel(CHANNEL);
    channel.postMessage({ type: "logout" } satisfies SessionMessage);
    channel.close();
  } catch {
    /* BroadcastChannel may be unavailable */
  }
}

/**
 * Subscribe to logout from another tab.
 * Does not fire for the tab that called `broadcastSessionLogout` via storage;
 * BroadcastChannel may deliver to the sender — callers should no-op if already cleared.
 */
export function subscribeSessionLogout(onLogout: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;

  const onStorage = (event: StorageEvent) => {
    if (event.storageArea !== window.localStorage) return;
    if (event.key === EPOCH_KEY && event.newValue) {
      onLogout();
      return;
    }
    if (event.key === logoutIntentStorageKey() && event.newValue === "1") {
      onLogout();
    }
  };

  let channel: BroadcastChannel | null = null;
  const onMessage = (event: MessageEvent<SessionMessage>) => {
    if (event.data?.type === "logout") onLogout();
  };

  window.addEventListener("storage", onStorage);
  try {
    channel = new BroadcastChannel(CHANNEL);
    channel.addEventListener("message", onMessage);
  } catch {
    channel = null;
  }

  return () => {
    window.removeEventListener("storage", onStorage);
    if (channel) {
      channel.removeEventListener("message", onMessage);
      channel.close();
    }
  };
}

export function otherTabLoggedOut(): boolean {
  return readLoggedOutIntent();
}
