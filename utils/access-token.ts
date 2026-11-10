/**
 * Access token lives in module memory for this page only.
 * The refresh cookie is HttpOnly; this file never reads it and never writes localStorage.
 */

type Listener = () => void;

let accessToken: string | null = null;
/** Absolute expiry time for the current access token, if Java sent `expiresIn`. */
let accessExpiresAtMs: number | null = null;
const listeners = new Set<Listener>();

export function getAccessToken(): string | null {
  return accessToken;
}

export function getAccessExpiresAt(): number | null {
  return accessExpiresAtMs;
}

export function getServerAccessToken(): null {
  return null;
}

/**
 * Set or clear the in-memory access token.
 * Pass `expiresIn` seconds from Java when known; omit/null clears the deadline.
 */
export function setAccessToken(token: string | null, expiresInSeconds?: number | null): void {
  accessToken = token;
  if (!token) {
    accessExpiresAtMs = null;
  } else if (typeof expiresInSeconds === "number" && Number.isFinite(expiresInSeconds) && expiresInSeconds > 0) {
    accessExpiresAtMs = Date.now() + Math.floor(expiresInSeconds) * 1000;
  } else {
    accessExpiresAtMs = null;
  }
  listeners.forEach((listener) => listener());
}

export function subscribeAccessToken(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
