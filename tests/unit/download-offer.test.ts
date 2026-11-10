import { afterEach, describe, expect, it } from "vitest";
import {
  hasSeenDownloadOffer,
  markDownloadOfferSeen,
  shouldOpenDownloadOffer,
} from "@/utils/download-offer";
import { prefixedKey } from "@/utils/storage-prefix";

const KEY = prefixedKey("download_oto_v2");

afterEach(() => {
  window.localStorage.removeItem(KEY);
});

describe("download offer", () => {
  it("opens once until marked seen", () => {
    expect(shouldOpenDownloadOffer()).toBe(true);
    expect(hasSeenDownloadOffer()).toBe(false);
    markDownloadOfferSeen();
    expect(shouldOpenDownloadOffer()).toBe(false);
    expect(hasSeenDownloadOffer()).toBe(true);
  });
});
