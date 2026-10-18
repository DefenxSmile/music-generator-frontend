/**
 * Cookie, localStorage and query names shared with the landing.
 * The prefix stays `lp_`: the marketing site already writes these keys.
 */

export const STORAGE_PREFIX = "lp_";

/** Namespace for custom DOM events and `data-*` attributes. */
export const NAMESPACE = "lp";

/** `lp_consent`, `lp_attribution`, … */
export function prefixedKey(name: string): string {
  return `${STORAGE_PREFIX}${name}`;
}
