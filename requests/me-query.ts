import { queryOptions } from "@tanstack/react-query";
import { fetchMe } from "@/requests/me";
import { queryKeys } from "@/requests/query-keys";
export function meQueryOptions(enabled: boolean) {
  return queryOptions({
    queryKey: queryKeys.me,
    queryFn: fetchMe,
    enabled,
  });
}
