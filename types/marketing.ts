export const ATTRIBUTION_QUERY_KEYS = [
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

export type AttributionKey = (typeof ATTRIBUTION_QUERY_KEYS)[number];
export type MarketingAttributionParams = Partial<Record<AttributionKey, string>>;
