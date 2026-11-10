export type ParsedAccessToken = {
  accessToken: string;
  /** Seconds until expiry from Java, when present and positive. */
  expiresIn: number | null;
  /** Present when Java returns refresh in the JSON body (stand contract). */
  refreshToken: string | null;
};

/** Read `accessToken`, optional `expiresIn` and `refreshToken` from a Java JSON body. */
export function readAccessTokenResponse(body: unknown): ParsedAccessToken | null {
  if (!body || typeof body !== "object") return null;
  const record = body as {
    accessToken?: unknown;
    expiresIn?: unknown;
    refreshToken?: unknown;
  };
  const accessToken = record.accessToken;
  if (typeof accessToken !== "string" || !accessToken) return null;
  const raw = record.expiresIn;
  const expiresIn =
    typeof raw === "number" && Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : null;
  const refreshRaw = record.refreshToken;
  const refreshToken =
    typeof refreshRaw === "string" && refreshRaw.trim() ? refreshRaw.trim() : null;
  return { accessToken, expiresIn, refreshToken };
}

/** Read `accessToken` from a Java access-token JSON body. */
export function readAccessToken(body: unknown): string | null {
  return readAccessTokenResponse(body)?.accessToken ?? null;
}
