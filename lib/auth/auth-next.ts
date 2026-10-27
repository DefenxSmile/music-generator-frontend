import { prefixedKey } from "@/lib/storage-prefix";

const AUTH_NEXT_KEY = prefixedKey("auth_next");

/** Only same-origin paths. Blocks protocol-relative and backslash tricks. */
export function safeNext(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return "/";
  return value;
}

export function rememberAuthNext(value: string): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(AUTH_NEXT_KEY, safeNext(value));
}

export function takeAuthNext(): string {
  if (typeof window === "undefined") return "/";
  const value = safeNext(window.sessionStorage.getItem(AUTH_NEXT_KEY));
  window.sessionStorage.removeItem(AUTH_NEXT_KEY);
  return value;
}
