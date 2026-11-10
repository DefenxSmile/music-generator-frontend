import type { GenerationQuote } from "@/types/billing";
import { fetchJson } from "@/requests/fetch-json";

export function fetchGenerationQuote(): Promise<GenerationQuote> {
  return fetchJson<GenerationQuote>("/api/v1/billing/generation-quote");
}
