import type { SessionStatus } from "@/types/session";

export function isAuthenticated(status: SessionStatus): boolean {
  return status === "authenticated";
}

export function isSessionLoading(status: SessionStatus): boolean {
  return status === "loading";
}

/** No usable access — anonymous or resume failed. */
export function isLoggedOut(status: SessionStatus): boolean {
  return status === "anonymous" || status === "resume_failed";
}

/** Account chrome while bootstrapping a previously signed-in tab. */
export function showAccountChrome(status: SessionStatus, signedInHint: boolean): boolean {
  return status === "authenticated" || (status === "loading" && signedInHint);
}
