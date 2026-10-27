import { fetchJson } from "@/lib/api/fetch-json";
import { getAccessToken, setAccessToken } from "@/lib/auth/access-token";
import { clearDevOauth, DEV_ACCESS_TOKEN, readDevOauth } from "@/lib/auth/dev-oauth";

export async function logoutAccount(): Promise<void> {
  const dev = getAccessToken() === DEV_ACCESS_TOKEN || readDevOauth() !== null;
  clearDevOauth();
  try {
    if (!dev) {
      await fetchJson<void>("/api/v1/auth/logout", { method: "POST" }, { retryOnUnauthorized: false });
    }
  } finally {
    setAccessToken(null);
  }
}
