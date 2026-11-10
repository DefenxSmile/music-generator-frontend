import { queryOptions } from "@tanstack/react-query";
import { fetchMe } from "@/requests/me";
import { queryKeys } from "@/requests/query-keys";
import { readMeSnapshot, writeMeSnapshot } from "@/utils/me-snapshot";

export function meQueryOptions(enabled: boolean) {
  return queryOptions({
    queryKey: queryKeys.me,
    queryFn: async () => {
      const me = await fetchMe();
      writeMeSnapshot(me);
      return me;
    },
    enabled,
    placeholderData: () => readMeSnapshot() ?? undefined,
  });
}
