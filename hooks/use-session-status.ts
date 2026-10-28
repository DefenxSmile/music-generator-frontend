"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAccessToken } from "@/hooks/use-access-token";
import { useHydrated } from "@/hooks/use-hydrated";
import { writeSignedInHint } from "@/hooks/use-signed-in-hint";
import { sessionQueryOptions } from "@/requests/session";
import type { SessionStatus } from "@/types/session";
import { DEV_ACCESS_TOKEN } from "@/utils/dev-oauth";

export function useSessionStatus(): SessionStatus {
  const hydrated = useHydrated();
  const token = useAccessToken();
  const resume = useQuery(sessionQueryOptions());

  useEffect(() => {
    if (!resume.isFetched) return;
    writeSignedInHint(Boolean(token));
  }, [resume.isFetched, token]);

  if (!hydrated) return "loading";
  // Dev sign-in writes the token while the first refresh may still be running.
  if (token === DEV_ACCESS_TOKEN) return "authenticated";
  if (!resume.isFetched) return "loading";
  return token ? "authenticated" : "anonymous";
}
