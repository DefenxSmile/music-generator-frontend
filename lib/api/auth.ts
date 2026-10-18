import { fetchJson } from "@/lib/api/fetch-json";
import { setAccessToken } from "@/lib/auth/access-token";

export type AccessTokenResponse = {
  accessToken: string;
  expiresIn: number;
};

export type RegisteredResponse = {
  id: string;
  email: string;
};

const publicCall = { retryOnUnauthorized: false } as const;

export async function registerAccount(email: string, password: string): Promise<RegisteredResponse> {
  return fetchJson<RegisteredResponse>(
    "/api/v1/auth/register",
    { method: "POST", body: JSON.stringify({ email, password }) },
    publicCall,
  );
}

export async function loginAccount(email: string, password: string): Promise<AccessTokenResponse> {
  const body = await fetchJson<AccessTokenResponse>(
    "/api/v1/auth/login",
    { method: "POST", body: JSON.stringify({ email, password }) },
    publicCall,
  );
  setAccessToken(body.accessToken);
  return body;
}

export async function logoutAccount(): Promise<void> {
  try {
    await fetchJson<void>("/api/v1/auth/logout", { method: "POST" }, publicCall);
  } finally {
    setAccessToken(null);
  }
}

export async function forgotPassword(email: string): Promise<void> {
  await fetchJson<void>(
    "/api/v1/auth/password/forgot",
    { method: "POST", body: JSON.stringify({ email }) },
    publicCall,
  );
}

export async function resetPassword(token: string, password: string): Promise<void> {
  await fetchJson<void>(
    "/api/v1/auth/password/reset",
    { method: "POST", body: JSON.stringify({ token, password }) },
    publicCall,
  );
}
