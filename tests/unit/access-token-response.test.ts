import { describe, expect, it } from "vitest";
import { readAccessToken, readAccessTokenResponse } from "@/utils/access-token-response";

describe("readAccessTokenResponse", () => {
  it("reads accessToken, expiresIn and refreshToken", () => {
    expect(
      readAccessTokenResponse({
        accessToken: "abc",
        expiresIn: 60,
        refreshToken: " r1 ",
      }),
    ).toEqual({
      accessToken: "abc",
      expiresIn: 60,
      refreshToken: "r1",
    });
  });

  it("rejects empty or missing values", () => {
    expect(readAccessTokenResponse(null)).toBeNull();
    expect(readAccessTokenResponse({})).toBeNull();
    expect(readAccessTokenResponse({ accessToken: "" })).toBeNull();
    expect(readAccessTokenResponse({ accessToken: 1 })).toBeNull();
  });

  it("treats non-positive expiresIn as null", () => {
    expect(readAccessTokenResponse({ accessToken: "abc", expiresIn: 0 })?.expiresIn).toBeNull();
    expect(readAccessTokenResponse({ accessToken: "abc" })?.expiresIn).toBeNull();
  });
});

describe("readAccessToken", () => {
  it("reads a non-empty accessToken string", () => {
    expect(readAccessToken({ accessToken: "abc", expiresIn: 60 })).toBe("abc");
  });
});
