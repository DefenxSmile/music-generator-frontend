"use client";

import { useQueryClient } from "@tanstack/react-query";
import { logoutAccount } from "@/requests/auth";
import { queryKeys } from "@/requests/query-keys";
import { writeSignedInHint } from "@/hooks/use-signed-in-hint";

export function useLogout() {
  const queryClient = useQueryClient();
  return async () => {
    await logoutAccount();
    writeSignedInHint(false);
    queryClient.clear();
    queryClient.setQueryData(queryKeys.session, null);
  };
}
