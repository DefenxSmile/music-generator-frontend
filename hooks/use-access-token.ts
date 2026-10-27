"use client";

import { useSyncExternalStore } from "react";
import { getAccessToken, getServerAccessToken, subscribeAccessToken } from "@/utils/access-token";

export function useAccessToken(): string | null {
  return useSyncExternalStore(subscribeAccessToken, getAccessToken, getServerAccessToken);
}
