export type ParsedAccessToken = {
  accessToken: string;
  /** Seconds until expiry from Java, when present and positive. */
  expiresIn: number | null;
};

/** Read `accessToken` and optional `expiresIn` from a Java access-token JSON body. */
export function readAccessTokenResponse(body: unknown): ParsedAccessToken | null {
  if (!body || typeof body !== "object") return null;
  const record = body as { accessToken?: unknown; expiresIn?: unknown };
  const accessToken = record.accessToken;
  if (typeof accessToken !== "string" || !accessToken) return null;
  const raw = record.expiresIn;
  const expiresIn =
    typeof raw === "number" && Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : null;
  return { accessToken, expiresIn };
}

/** Read `accessToken` from a Java access-token JSON body. */
export function readAccessToken(body: unknown): string | null {
  return readAccessTokenResponse(body)?.accessToken ?? null;
}
