import { fetchJson } from "@/requests/fetch-json";
import { getAccessToken, setAccessToken } from "@/utils/access-token";
import { clearDevOauth, DEV_ACCESS_TOKEN, readDevOauth } from "@/utils/dev-oauth";
export async function logoutAccount(): Promise<void> {
  const dev = getAccessToken() === DEV_ACCESS_TOKEN || readDevOauth() !== null;
  clearDevOauth();
  try {
    if (!dev) {
      await fetchJson<void>(
        "/api/v1/auth/logout",
        { method: "POST" },
        { retryOnUnauthorized: false },
      );
    }
  } finally {
    setAccessToken(null);
  }
}
