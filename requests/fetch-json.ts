import { ApiError } from "@/requests/api-error";
import { refreshAccessToken } from "@/requests/refresh-access-token";
import { getAccessToken } from "@/utils/access-token";
import { javaApiBaseUrl } from "@/utils/java-api";

const NO_REFRESH_PATHS = new Set(["/api/v1/auth/refresh", "/api/v1/auth/logout"]);

type FetchJsonOptions = {
  /** Protected calls retry once after refresh. Refresh and logout do not. */
  retryOnUnauthorized?: boolean;
};

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
    const errorCode =
      typeof body.errorCode === "string" && body.errorCode ? body.errorCode : "UNKNOWN";
    const details = { ...body };
    delete details.errorCode;
    delete details.message;
    return new ApiError(message, response.status, errorCode, details);
  } catch {
    return new ApiError(
      fallback,
      response.status,
      response.status === 401 ? "UNAUTHORIZED" : "UNKNOWN",
    );
  }
}

async function readBody<T>(response: Response): Promise<T> {
  if (response.status === 204 || response.status === 205) return undefined as T;
  const text = await response.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

function buildHeaders(init?: RequestInit): Headers {
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
  return headers;
}

function request(path: string, init: RequestInit | undefined, headers: Headers): Promise<Response> {
  return fetch(apiUrl(path), {
    ...init,
    headers,
    credentials: "include",
    cache: "no-store",
  });
}

/**
 * Browser call to Java (`JAVA_API_BASE_URL`) with credentials for the refresh cookie.
 * Does not send headers outside the Java CORS allow-list.
 */
export async function fetchJson<T>(
  path: string,
  init?: RequestInit,
  options?: FetchJsonOptions,
): Promise<T> {
  const headers = buildHeaders(init);
  const response = await request(path, init, headers);

  const mayRefresh =
    response.status === 401 &&
    options?.retryOnUnauthorized !== false &&
    !NO_REFRESH_PATHS.has(path);

  if (mayRefresh) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      headers.set("Authorization", `Bearer ${refreshed}`);
      const retried = await request(path, init, headers);
      if (!retried.ok) throw await parseError(retried);
      return readBody<T>(retried);
    }
  }

  if (!response.ok) throw await parseError(response);
  return readBody<T>(response);
}
