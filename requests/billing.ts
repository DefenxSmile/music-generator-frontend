import type { GenerationQuote } from "@/types/billing";
import { fetchJson } from "@/requests/fetch-json";
import { getAccessToken } from "@/utils/access-token";
import { DEV_ACCESS_TOKEN } from "@/utils/dev-oauth";
export function fetchGenerationQuote(): Promise<GenerationQuote> {
  if (getAccessToken() === DEV_ACCESS_TOKEN) {
    return Promise.resolve({ balance: 0, cost: 1, sufficient: false });
  }
  return fetchJson<GenerationQuote>("/api/v1/billing/generation-quote");
}
