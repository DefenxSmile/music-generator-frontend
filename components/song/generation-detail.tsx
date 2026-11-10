"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import {
  GenerationResult,
  GenerationResultSkeleton,
} from "@/components/create/generation-result";
import { DetailMessage } from "@/components/song/detail-message";
import { OpenSongButton } from "@/components/song/open-song-button";
import { useSessionStatus } from "@/hooks/use-session-status";
import { useSignedInHint } from "@/hooks/use-signed-in-hint";
import { apiErrorMessage } from "@/requests/api-error";
import { generationQueryOptions } from "@/requests/generations-query";
import { generationHref } from "@/utils/generation-href";
import { isAuthenticated, isLoggedOut, isSessionLoading } from "@/utils/session-status";

export function GenerationDetail() {
  const id = useSearchParams().get("id")?.trim() ?? "";
  const status = useSessionStatus();
  const signedIn = useSignedInHint();
  const query = useQuery(generationQueryOptions(id, isAuthenticated(status)));

  if (!id) {
    return <DetailMessage text="В ссылке нет песни." />;
  }

  if (isLoggedOut(status) || (isSessionLoading(status) && !signedIn)) {
    return (
      <DetailMessage text="Войдите, чтобы открыть песню.">
        <OpenSongButton next={generationHref(id)} />
      </DetailMessage>
    );
  }

  if (isSessionLoading(status) || query.isPending) {
    return <GenerationResultSkeleton />;
  }

  if (query.isError) {
    return <DetailMessage text={apiErrorMessage(query.error)} />;
  }

  return <GenerationResult generation={query.data} />;
}
