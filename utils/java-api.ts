/**
 * Java API origin (`JAVA_API_BASE_URL`), no trailing slash.
 * Browser calls this host directly in every environment.
 * Java `app.corsOrigins` must include the app origin.
 */
export function javaApiBaseUrl(): string {
  return (process.env.JAVA_API_BASE_URL?.trim() ?? "").replace(/\/+$/, "");
}
