"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSyncExternalStore } from "react";
import { logoutAccount } from "@/lib/api/auth";
import { fetchMe } from "@/lib/api/me";
import { refreshAccessToken } from "@/lib/api/fetch-json";
import {
  getAccessToken,
  getServerAccessToken,
  subscribeAccessToken,
} from "@/lib/auth/access-token";

export type SessionStatus = "loading" | "anonymous" | "authenticated";

function useAccessToken(): string | null {
  return useSyncExternalStore(subscribeAccessToken, getAccessToken, getServerAccessToken);
}

const noopSubscribe = () => () => {};

/** False while hydrating, so late Suspense boundaries render the same "loading" HTML as the server. */
function useHydrated(): boolean {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

export function useSessionStatus(): SessionStatus {
  const hydrated = useHydrated();
  const token = useAccessToken();
  const resume = useQuery({
    queryKey: ["session-resume"],
    queryFn: () => refreshAccessToken(),
    enabled: typeof window !== "undefined",
    staleTime: Infinity,
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  if (!hydrated || !resume.isFetched) return "loading";
  return token ? "authenticated" : "anonymous";
}

export function useMe() {
  const status = useSessionStatus();
  return useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
    enabled: status === "authenticated",
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return async () => {
    await logoutAccount();
    queryClient.clear();
    queryClient.setQueryData(["session-resume"], null);
  };
}
