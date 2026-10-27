import { ApiError } from "@/requests/api-error";
import { getAccessToken, setAccessToken } from "@/utils/access-token";
import { DEV_ACCESS_TOKEN, readDevOauth } from "@/utils/dev-oauth";
import { javaApiBaseUrl } from "@/utils/java-api";
const PUBLIC_AUTH_PATHS = new Set(["/api/v1/auth/refresh", "/api/v1/auth/logout"]);

let refreshInFlight: Promise<string | null> | null = null;

function apiUrl(path: string): string {
  const base = javaApiBaseUrl();
  if (!base) {
    throw new ApiError("Не задан адрес API (JAVA_API_BASE_URL).", 0, "API_BASE_MISSING");
  }
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

async function parseError(response: Response): Promise<ApiError> {
  const fallback = response.status === 401 ? "Нужно войти" : "Не получилось выполнить запрос";
  try {
    const body = (await response.json()) as Record<string, unknown>;
    const message = typeof body.message === "string" && body.message ? body.message : fallback;
    const errorCode = typeof body.errorCode === "string" && body.errorCode ? body.errorCode : "UNKNOWN";
    const details = { ...body };
    delete details.errorCode;
    delete details.message;
    return new ApiError(message, response.status, errorCode, details);
  } catch {
    return new ApiError(fallback, response.status, response.status === 401 ? "UNAUTHORIZED" : "UNKNOWN");
  }
}

async function readBody<T>(response: Response): Promise<T> {
  if (response.status === 204 || response.status === 205) return undefined as T;
  const text = await response.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

/** One refresh for parallel 401s. Java rotates the cookie, so a second call would revoke the first. */
export function refreshAccessToken(): Promise<string | null> {
  if (!refreshInFlight) {
    refreshInFlight = performRefresh().finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}

async function performRefresh(): Promise<string | null> {
  if (readDevOauth()) {
    setAccessToken(DEV_ACCESS_TOKEN);
    return DEV_ACCESS_TOKEN;
  }
  const base = javaApiBaseUrl();
  if (!base) {
    setAccessToken(null);
    return null;
  }
  try {
    const response = await fetch(`${base}/api/v1/auth/refresh`, {
      method: "POST",
      credentials: "include",
      cache: "no-store",
    });
    if (!response.ok) {
      setAccessToken(null);
      return null;
    }
    const body = (await response.json()) as { accessToken?: unknown };
    if (typeof body.accessToken !== "string" || !body.accessToken) {
      setAccessToken(null);
      return null;
    }
    setAccessToken(body.accessToken);
    return body.accessToken;
  } catch {
    setAccessToken(null);
    return null;
  }
}

type FetchJsonOptions = {
  /** Protected calls retry once after refresh. Refresh and logout do not. */
  retryOnUnauthorized?: boolean;
};

/**
 * Browser call to JAVA_API_BASE_URL.
 * Sends credentials so the HttpOnly refresh cookie can travel.
 * Does not attach headers outside the Java CORS allow-list.
 */
export async function fetchJson<T>(
  path: string,
  init?: RequestInit,
  options?: FetchJsonOptions,
): Promise<T> {
  const headers = new Headers(init?.headers);
  const token = getAccessToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (
    init?.body !== undefined &&
    !headers.has("Content-Type") &&
    !(typeof FormData !== "undefined" && init.body instanceof FormData)
  ) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(apiUrl(path), {
    ...init,
    headers,
    credentials: "include",
    cache: "no-store",
  });

  const mayRefresh =
    response.status === 401 &&
    options?.retryOnUnauthorized !== false &&
    !PUBLIC_AUTH_PATHS.has(path);

  if (mayRefresh) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      headers.set("Authorization", `Bearer ${refreshed}`);
      const retried = await fetch(apiUrl(path), {
        ...init,
        headers,
        credentials: "include",
        cache: "no-store",
      });
      if (!retried.ok) throw await parseError(retried);
      return readBody<T>(retried);
    }
  }

  if (!response.ok) throw await parseError(response);
  return readBody<T>(response);
}
