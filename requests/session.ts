import { queryOptions } from "@tanstack/react-query";
import { refreshAccessToken } from "@/requests/fetch-json";
import { queryKeys } from "@/requests/query-keys";
/** One resume per tab. A dead API resolves to null instead of retrying. */
export function sessionQueryOptions() {
  return queryOptions({
    queryKey: queryKeys.session,
    queryFn: () => refreshAccessToken(),
    enabled: typeof window !== "undefined",
    staleTime: Infinity,
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}
