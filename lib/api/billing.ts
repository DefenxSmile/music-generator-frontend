import { fetchJson } from "@/lib/api/fetch-json";
import { getAccessToken } from "@/lib/auth/access-token";
import { DEV_ACCESS_TOKEN } from "@/lib/auth/dev-oauth";

export type GenerationQuote = {
  balance: number;
  cost: number;
  sufficient: boolean;
};

export function fetchGenerationQuote(): Promise<GenerationQuote> {
  if (getAccessToken() === DEV_ACCESS_TOKEN) {
    return Promise.resolve({ balance: 0, cost: 1, sufficient: false });
  }
  return fetchJson<GenerationQuote>("/api/v1/billing/generation-quote");
}
