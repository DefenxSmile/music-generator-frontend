import { queryOptions } from "@tanstack/react-query";
import { fetchGeneration, listGenerations } from "@/requests/generations";
import { queryKeys } from "@/requests/query-keys";
import { isActiveGenerationStatus } from "@/utils/generation-status";
const POLL_MS = 2_000;

export function generationsQueryOptions(enabled: boolean) {
  return queryOptions({
    queryKey: queryKeys.generations,
    queryFn: listGenerations,
    enabled,
    refetchInterval: (query) =>
      query.state.data?.some((item) => isActiveGenerationStatus(item.status)) ? POLL_MS : false,
  });
}

export function generationQueryOptions(id: string, enabled: boolean) {
  return queryOptions({
    queryKey: queryKeys.generation(id),
    queryFn: () => fetchGeneration(id),
    enabled: enabled && id.length > 0,
    refetchInterval: (query) =>
      query.state.data && isActiveGenerationStatus(query.state.data.status) ? POLL_MS : false,
  });
}
