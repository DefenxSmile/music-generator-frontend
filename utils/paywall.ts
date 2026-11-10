import { isApiError } from "@/requests/api-error";

/** Java `402 INSUFFICIENT_CREDITS` — open the same plans as `/plans`. */
export function shouldOpenPaywall(error: unknown): boolean {
  return isApiError(error) && error.status === 402;
}
