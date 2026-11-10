import { afterEach, describe, expect, it } from "vitest";
import {
  clearLoggedOutIntent,
  markLoggedOutIntent,
  readLoggedOutIntent,
} from "@/utils/logout-intent";

describe("logout-intent", () => {
  afterEach(() => {
    clearLoggedOutIntent();
  });

  it("starts unset", () => {
    expect(readLoggedOutIntent()).toBe(false);
  });

  it("marks and clears logout intent", () => {
    markLoggedOutIntent();
    expect(readLoggedOutIntent()).toBe(true);
    clearLoggedOutIntent();
    expect(readLoggedOutIntent()).toBe(false);
  });
});
