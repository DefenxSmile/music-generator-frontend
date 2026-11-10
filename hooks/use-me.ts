"use client";

import { useQuery } from "@tanstack/react-query";
import { useSessionStatus } from "@/hooks/use-session-status";
import { meQueryOptions } from "@/requests/me-query";
import { isAuthenticated } from "@/utils/session-status";

export function useMe() {
  const status = useSessionStatus();
  return useQuery(meQueryOptions(isAuthenticated(status)));
}
