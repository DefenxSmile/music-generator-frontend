import { QueryClient } from "@tanstack/react-query";
import { ApiError } from "@/requests/api-error";
export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          if (error instanceof ApiError && error.status < 500) return false;
          return failureCount < 1;
        },
      },
      mutations: { retry: false },
    },
  });
}
