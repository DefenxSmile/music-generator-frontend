/** Browser-facing Java origin. Inlined from JAVA_API_BASE_URL at build time. */
export function javaApiBaseUrl(): string {
  const raw = process.env.JAVA_API_BASE_URL?.trim() ?? "";
  return raw.replace(/\/+$/, "");
}
