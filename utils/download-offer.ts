import { prefixedKey } from "@/utils/storage-prefix";

/** v2: only set after the offer step is actually shown (v1 could stick after a failed swap). */
const SEEN_KEY = prefixedKey("download_oto_v2");

/** Preview one-time offer after declining the download paywall. Not a real charge. */
export const DOWNLOAD_OFFER = {
  planId: "pack",
  name: "Несколько песен",
  regularPrice: "1 290 ₽",
  offerPrice: "645 ₽",
  priceNote: "пакет из 5 генераций · один раз",
  description: "Скачайте готовую песню и ещё четыре генерации по специальной цене.",
  features: ["Пять генераций", "Музыка и русский вокал", "Скачивание готового трека"],
} as const;

export function hasSeenDownloadOffer(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return window.localStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return true;
  }
}

export function markDownloadOfferSeen(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SEEN_KEY, "1");
  } catch {
    /* private mode */
  }
}

/** Only after a dismissed download paywall, and only once per browser. */
export function shouldOpenDownloadOffer(): boolean {
  return !hasSeenDownloadOffer();
}
