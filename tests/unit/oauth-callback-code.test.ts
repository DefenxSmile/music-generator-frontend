import { afterEach, describe, expect, it } from "vitest";
import {
  clearOauthCallbackCode,
  readAndClearOauthCallbackCode,
} from "@/utils/oauth-callback-code";

describe("oauth-callback-code", () => {
  afterEach(() => {
    clearOauthCallbackCode();
    window.history.replaceState(null, "", "/oauth/callback");
  });

  it("reads #code, stashes it, and clears the hash", () => {
    window.history.replaceState(null, "", "/oauth/callback#code=abc123");
    expect(readAndClearOauthCallbackCode()).toBe("abc123");
    expect(window.location.hash).toBe("");
    expect(window.location.pathname).toBe("/oauth/callback");
  });

  it("returns the stashed code after a remount without hash", () => {
    window.history.replaceState(null, "", "/oauth/callback#code=once");
    expect(readAndClearOauthCallbackCode()).toBe("once");
    expect(readAndClearOauthCallbackCode()).toBe("once");
    clearOauthCallbackCode();
    expect(readAndClearOauthCallbackCode()).toBeNull();
  });
});
