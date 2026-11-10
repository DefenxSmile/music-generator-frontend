import { afterEach, describe, expect, it, vi } from "vitest";
import { clearLoggedOutIntent, markLoggedOutIntent } from "@/utils/logout-intent";
import { broadcastSessionLogout, subscribeSessionLogout } from "@/utils/session-broadcast";
import { prefixedKey } from "@/utils/storage-prefix";

describe("session-broadcast", () => {
  afterEach(() => {
    clearLoggedOutIntent();
    try {
      window.localStorage.removeItem(prefixedKey("session_epoch"));
    } catch {
      /* ignore */
    }
  });

  it("writes a session epoch for other tabs", () => {
    broadcastSessionLogout();
    expect(window.localStorage.getItem(prefixedKey("session_epoch"))).toBeTruthy();
  });

  it("notifies subscribers on logout intent storage events", () => {
    const onLogout = vi.fn();
    const stop = subscribeSessionLogout(onLogout);
    markLoggedOutIntent();
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: prefixedKey("logged_out"),
        newValue: "1",
        storageArea: window.localStorage,
      }),
    );
    expect(onLogout).toHaveBeenCalledOnce();
    stop();
  });
});
