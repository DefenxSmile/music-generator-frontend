/**
 * Access token lives in module memory for this page only.
 * The refresh cookie is HttpOnly; this file never reads it and never writes localStorage.
 */

type Listener = () => void;

let accessToken: string | null = null;
const listeners = new Set<Listener>();

export function getAccessToken(): string | null {
  return accessToken;
}

export function getServerAccessToken(): null {
  return null;
}

export function setAccessToken(token: string | null): void {
  accessToken = token;
  listeners.forEach((listener) => listener());
}

export function subscribeAccessToken(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
