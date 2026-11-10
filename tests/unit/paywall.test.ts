import { describe, expect, it } from "vitest";
import { ApiError } from "@/requests/api-error";
import { shouldOpenPaywall } from "@/utils/paywall";

describe("shouldOpenPaywall", () => {
  it("opens only on 402", () => {
    expect(shouldOpenPaywall(new ApiError("Нет кредитов", 402, "INSUFFICIENT_CREDITS"))).toBe(true);
    expect(shouldOpenPaywall(new ApiError("Нужно войти", 401, "UNAUTHORIZED"))).toBe(false);
    expect(shouldOpenPaywall(new Error("network"))).toBe(false);
  });
});
