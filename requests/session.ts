import { queryOptions } from "@tanstack/react-query";
import { refreshAccessToken } from "@/requests/refresh-access-token";
import { queryKeys } from "@/requests/query-keys";
import { getAccessToken } from "@/utils/access-token";
import { clearLoggedOutIntent, readLoggedOutIntent } from "@/utils/logout-intent";

/** One session resume per tab. Prefer an access token already set by OAuth. */
export function sessionQueryOptions(enabled = true) {
  return queryOptions({
    queryKey: queryKeys.session,
    queryFn: async () => {
      if (readLoggedOutIntent()) return null;
      const existing = getAccessToken();
      if (existing) return existing;
      const refreshed = await refreshAccessToken();
      if (refreshed) clearLoggedOutIntent();
      return refreshed;
    },
    enabled: typeof window !== "undefined" && enabled,
    staleTime: Infinity,
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}
