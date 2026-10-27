/**
 * Cookie, localStorage and query names shared with the landing.
 * The prefix stays `lp_`: the marketing site already writes these keys.
 */

const STORAGE_PREFIX = "lp_";

/** `lp_consent`, `lp_attribution`, … */
export function prefixedKey(name: string): string {
  return `${STORAGE_PREFIX}${name}`;
}
