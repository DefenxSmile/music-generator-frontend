"use client";

import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccessToken } from "@/hooks/use-access-token";
import { useHydrated } from "@/hooks/use-hydrated";
import { readSignedInHint, writeSignedInHint } from "@/hooks/use-signed-in-hint";
import { sessionQueryOptions } from "@/requests/session";
import type { SessionStatus } from "@/types/session";
import { readLoggedOutIntent } from "@/utils/logout-intent";

/**
 * Single owner of session phase for the tab.
 * States: loading → authenticated | anonymous | resume_failed.
 */
export function useSessionStatus(): SessionStatus {
  const hydrated = useHydrated();
  const token = useAccessToken();
  const pathname = usePathname();
  const onOauthCallback = pathname.startsWith("/oauth");
  const resume = useQuery(sessionQueryOptions(!onOauthCallback));
  const [resumeFailed, setResumeFailed] = useState(false);

  useEffect(() => {
    if (onOauthCallback) return;
    if (!resume.isFetched) return;

    if (token) {
      setResumeFailed(false);
      writeSignedInHint(true);
      return;
    }

    // Capture hint before clearing: previously signed-in tab that could not refresh.
    if (readSignedInHint() && !readLoggedOutIntent()) {
      setResumeFailed(true);
    } else {
      setResumeFailed(false);
    }
    writeSignedInHint(false);
  }, [onOauthCallback, resume.isFetched, token]);

  if (!hydrated) return "loading";
  if (onOauthCallback) return token ? "authenticated" : "loading";
  if (!resume.isFetched) return "loading";
  if (token) return "authenticated";
  if (resumeFailed) return "resume_failed";
  return "anonymous";
}
