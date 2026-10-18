/**
 * Accept the landing consent handoff.
 * Storage shape matches the landing (`lp_consent`). No tag manager and no analytics.
 */

import { prefixedKey } from "@/lib/storage-prefix";

export type ConsentValue = "denied" | "granted";

export type ConsentState = {
  ad_storage: ConsentValue;
  analytics_storage: ConsentValue;
  ad_user_data: ConsentValue;
  ad_personalization: ConsentValue;
};

export const CONSENT_STORAGE_KEY = prefixedKey("consent");
export const CONSENT_QUERY_PARAM = prefixedKey("consent");

const CONSENT_KEYS = [
  "ad_storage",
  "analytics_storage",
  "ad_user_data",
  "ad_personalization",
] as const;

const CONSENT_COOKIE_MAX_AGE_SEC = 180 * 24 * 60 * 60;

function isConsentValue(value: unknown): value is ConsentValue {
  return value === "denied" || value === "granted";
}

function buildConsentState(value: ConsentValue): ConsentState {
  return {
    ad_storage: value,
    analytics_storage: value,
    ad_user_data: value,
    ad_personalization: value,
  };
}

function isConsentState(value: unknown): value is ConsentState {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return CONSENT_KEYS.every((key) => isConsentValue(record[key]));
}

function readConsentFromQuery(): ConsentValue | null {
  const value = new URLSearchParams(window.location.search).get(CONSENT_QUERY_PARAM);
  return isConsentValue(value) ? value : null;
}

function readConsentChoiceCookie(): ConsentValue | null {
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${CONSENT_STORAGE_KEY}=(granted|denied)(?:;|$)`),
  );
  const value = match?.[1];
  return isConsentValue(value) ? value : null;
}

function writeConsentChoiceCookie(value: ConsentValue): void {
  const parts = [
    `${CONSENT_STORAGE_KEY}=${value}`,
    "Path=/",
    `Max-Age=${CONSENT_COOKIE_MAX_AGE_SEC}`,
    "SameSite=Lax",
  ];
  if (window.location.protocol === "https:") {
    parts.push("Secure");
  }
  document.cookie = parts.join("; ");
}

function readConsentFromLocalStorage(): ConsentState | null {
  const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    return isConsentState(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function persistConsent(value: ConsentValue): void {
  window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(buildConsentState(value)));
  writeConsentChoiceCookie(value);
}

function stripConsentQueryParam(): void {
  const url = new URL(window.location.href);
  if (!url.searchParams.has(CONSENT_QUERY_PARAM)) return;
  url.searchParams.delete(CONSENT_QUERY_PARAM);
  window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
}

/** Imports `lp_consent` from the query, then from the cookie, the same way the landing does. */
export function acceptLandingConsent(): void {
  if (typeof window === "undefined") return;
  const fromQuery = readConsentFromQuery();
  if (fromQuery) {
    persistConsent(fromQuery);
    stripConsentQueryParam();
    return;
  }
  if (readConsentFromLocalStorage()) return;
  const fromCookie = readConsentChoiceCookie();
  if (fromCookie) persistConsent(fromCookie);
}
