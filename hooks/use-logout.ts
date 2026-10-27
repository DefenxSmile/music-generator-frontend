"use client";

import { useQueryClient } from "@tanstack/react-query";
import { logoutAccount } from "@/requests/auth";
import { queryKeys } from "@/requests/query-keys";

export function useLogout() {
  const queryClient = useQueryClient();
  return async () => {
    await logoutAccount();
    queryClient.clear();
    queryClient.setQueryData(queryKeys.session, null);
  };
}
