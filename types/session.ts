/**
 * Session phase for the current tab.
 * - loading: hydrate or cookie resume in flight (qualify-hold may apply)
 * - authenticated: in-memory access token present
 * - anonymous: no session and no failed resume to surface
 * - resume_failed: refresh could not restore a previously hinted session; hold must release
 */
export type SessionStatus = "loading" | "anonymous" | "authenticated" | "resume_failed";
