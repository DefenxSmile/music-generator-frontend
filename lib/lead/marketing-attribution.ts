/**
 * First-touch campaign params from the landing links.
 * Stored under `lp_attribution` only. Never sent to the Java API.
 */

import { prefixedKey } from "@/lib/storage-prefix";

const ATTRIBUTION_QUERY_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "gbraid",
  "wbraid",
  "fbclid",
  "yclid",
] as const;

type AttributionKey = (typeof ATTRIBUTION_QUERY_KEYS)[number];
type MarketingAttributionParams = Partial<Record<AttributionKey, string>>;
type StoredMarketingAttribution = {
  savedAt: number;
  params: MarketingAttributionParams;
};

const ATTRIBUTION_STORAGE_KEY = prefixedKey("attribution");
const ATTRIBUTION_TTL_MS = 90 * 24 * 60 * 60 * 1000;

function clean(value: string | null): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function readAttributionFromSearch(search: string): MarketingAttributionParams {
  const sourceParams = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const params: MarketingAttributionParams = {};
  for (const key of ATTRIBUTION_QUERY_KEYS) {
    const value = clean(sourceParams.get(key));
    if (value) params[key] = value;
  }
  return params;
}

function hasAttributionParams(params: MarketingAttributionParams): boolean {
  return ATTRIBUTION_QUERY_KEYS.some((key) => Boolean(params[key]));
}

function mergeFirstTouch(
  saved: MarketingAttributionParams,
  fresh: MarketingAttributionParams,
): MarketingAttributionParams {
  const merged: MarketingAttributionParams = {};
  for (const key of ATTRIBUTION_QUERY_KEYS) {
    const value = saved[key] ?? fresh[key];
    if (value) merged[key] = value;
  }
  return merged;
}

export function readMarketingAttribution(now = Date.now()): MarketingAttributionParams {
  const raw = window.localStorage.getItem(ATTRIBUTION_STORAGE_KEY);
  if (!raw) return {};
  try {
    const stored = JSON.parse(raw) as Partial<StoredMarketingAttribution>;
    if (typeof stored.savedAt !== "number" || now - stored.savedAt > ATTRIBUTION_TTL_MS) {
      window.localStorage.removeItem(ATTRIBUTION_STORAGE_KEY);
      return {};
    }
    return stored.params && typeof stored.params === "object" ? stored.params : {};
  } catch {
    return {};
  }
}

function writeStoredAttribution(params: MarketingAttributionParams, now = Date.now()): void {
  if (!hasAttributionParams(params)) return;
  const payload: StoredMarketingAttribution = { savedAt: now, params };
  window.localStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(payload));
}

export function captureMarketingAttribution(search?: string): void {
  if (typeof window === "undefined") return;
  const currentSearch = search ?? window.location.search;
  const merged = mergeFirstTouch(readMarketingAttribution(), readAttributionFromSearch(currentSearch));
  writeStoredAttribution(merged);
}
