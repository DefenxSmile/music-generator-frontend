/**
 * Java API origin (`JAVA_API_BASE_URL`), no trailing slash.
 *
 * Local CORS bypass: set `JAVA_API_PROXY=1` so Next rewrites `/api/v1/*` to Java
 * and the browser calls same-origin paths (see `next.config.ts`).
 * OAuth start still uses the absolute origin so PKCE cookies stay on the API host.
 */

/** Absolute Java host — OAuth redirects and rewrite target. */
export function javaApiOrigin(): string {
  return (process.env.JAVA_API_BASE_URL?.trim() ?? "").replace(/\/+$/, "");
}

/** Browser uses same-origin `/api/v1/…` via Next rewrite when this is on. */
export function javaApiProxyEnabled(): boolean {
  return process.env.NEXT_PUBLIC_JAVA_API_PROXY === "1";
}

/**
 * Base URL for XHR/fetch to Java.
 * Empty string = same origin (proxy). Otherwise absolute `JAVA_API_BASE_URL`.
 */
export function javaApiBaseUrl(): string {
  if (javaApiProxyEnabled()) return "";
  return javaApiOrigin();
}

export function javaApiConfigured(): boolean {
  return Boolean(javaApiOrigin());
}

/** Join API path with the fetch base (proxy → relative `/api/v1/…`). */
export function javaApiUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const base = javaApiBaseUrl();
  return base ? `${base}${normalized}` : normalized;
}
