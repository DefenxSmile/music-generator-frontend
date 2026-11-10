import { describe, expect, it } from "vitest";
import {
  isAuthenticated,
  isLoggedOut,
  isSessionLoading,
  showAccountChrome,
} from "@/utils/session-status";

describe("session-status helpers", () => {
  it("classifies phases", () => {
    expect(isAuthenticated("authenticated")).toBe(true);
    expect(isLoggedOut("anonymous")).toBe(true);
    expect(isLoggedOut("resume_failed")).toBe(true);
    expect(isLoggedOut("authenticated")).toBe(false);
    expect(isSessionLoading("loading")).toBe(true);
  });

  it("shows account chrome only while authenticated or loading with hint", () => {
    expect(showAccountChrome("authenticated", false)).toBe(true);
    expect(showAccountChrome("loading", true)).toBe(true);
    expect(showAccountChrome("loading", false)).toBe(false);
    expect(showAccountChrome("resume_failed", true)).toBe(false);
    expect(showAccountChrome("anonymous", true)).toBe(false);
  });
});
