import { prefixedKey } from "@/lib/storage-prefix";

/**
 * Local stand-in for Yandex and VK while Java has no OAuth routes.
 * Compiled out of production: every branch checks NODE_ENV.
 * The value in sessionStorage is only which button was pressed, not a token.
 */
const DEV_OAUTH_KEY = prefixedKey("dev_oauth");

export const DEV_ACCESS_TOKEN = "dev-oauth";

export type DevOauthProvider = "yandex" | "vk";

export function devOauthEnabled(): boolean {
  return process.env.NODE_ENV === "development";
}

export function rememberDevOauth(provider: DevOauthProvider): void {
  if (!devOauthEnabled() || typeof window === "undefined") return;
  window.sessionStorage.setItem(DEV_OAUTH_KEY, provider);
}

export function readDevOauth(): DevOauthProvider | null {
  if (!devOauthEnabled() || typeof window === "undefined") return null;
  const value = window.sessionStorage.getItem(DEV_OAUTH_KEY);
  return value === "yandex" || value === "vk" ? value : null;
}

export function clearDevOauth(): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(DEV_OAUTH_KEY);
}
