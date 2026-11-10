"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAccessToken } from "@/hooks/use-access-token";
import { writeSignedInHint } from "@/hooks/use-signed-in-hint";
import { refreshAccessToken } from "@/requests/refresh-access-token";
import { queryKeys } from "@/requests/query-keys";
import { getAccessExpiresAt, getAccessToken, setAccessToken } from "@/utils/access-token";
import { clearRefreshToken } from "@/utils/refresh-token";
import {
  bindProactiveRefresh,
  cancelProactiveRefresh,
  syncProactiveRefresh,
} from "@/utils/proactive-refresh";
import { subscribeSessionLogout } from "@/utils/session-broadcast";

/**
 * Client bootstrap for proactive refresh and cross-tab logout.
 * Mount once under QueryClientProvider.
 */
export function SessionLifecycle() {
  const queryClient = useQueryClient();
  const token = useAccessToken();

  useEffect(() => {
    bindProactiveRefresh(refreshAccessToken);
    return () => {
      cancelProactiveRefresh();
    };
  }, []);

  useEffect(() => {
    if (token && getAccessExpiresAt()) syncProactiveRefresh();
    else cancelProactiveRefresh();
  }, [token]);

  useEffect(() => {
    return subscribeSessionLogout(() => {
      if (!getAccessToken()) {
        writeSignedInHint(false);
        queryClient.setQueryData(queryKeys.session, null);
        return;
      }
      setAccessToken(null);
      clearRefreshToken();
      cancelProactiveRefresh();
      writeSignedInHint(false);
      queryClient.clear();
      queryClient.setQueryData(queryKeys.session, null);
    });
  }, [queryClient]);

  return null;
}
