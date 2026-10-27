import { queryOptions } from "@tanstack/react-query";
import { fetchGenerationQuote } from "@/requests/billing";
import { queryKeys } from "@/requests/query-keys";
export function generationQuoteQueryOptions(enabled: boolean) {
  return queryOptions({
    queryKey: queryKeys.quote,
    queryFn: fetchGenerationQuote,
    enabled,
  });
}
