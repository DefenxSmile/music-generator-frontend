import { fetchJson } from "@/lib/api/fetch-json";

export type GenerationQuote = {
  balance: number;
  cost: number;
  sufficient: boolean;
};

export function fetchGenerationQuote(): Promise<GenerationQuote> {
  return fetchJson<GenerationQuote>("/api/v1/billing/generation-quote");
}
