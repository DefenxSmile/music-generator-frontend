"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { DetailMessage } from "@/components/song/detail-message";
import { GenerationCard } from "@/components/song/generation-card";
import { GenerationCardSkeleton } from "@/components/song/generation-card-skeleton";
import { OpenSongButton } from "@/components/song/open-song-button";
import { useSessionStatus } from "@/hooks/use-session-status";
import { useSignedInHint } from "@/hooks/use-signed-in-hint";
import { apiErrorMessage } from "@/requests/api-error";
import { generationQueryOptions } from "@/requests/generations-query";
import { generationHref } from "@/utils/generation-href";

export function GenerationDetail() {
  const id = useSearchParams().get("id")?.trim() ?? "";
  const status = useSessionStatus();
  const signedIn = useSignedInHint();
  const query = useQuery(generationQueryOptions(id, status === "authenticated"));

  if (!id) {
    return <DetailMessage text="В ссылке нет песни." />;
  }

  if (status === "anonymous" || (status === "loading" && !signedIn)) {
    return (
      <DetailMessage text="Войдите, чтобы открыть песню.">
        <OpenSongButton next={generationHref(id)} />
      </DetailMessage>
    );
  }

  if (status === "loading" || query.isPending) {
    return <GenerationCardSkeleton />;
  }

  if (query.isError) {
    return <DetailMessage text={apiErrorMessage(query.error)} />;
  }

  return <GenerationCard generation={query.data} />;
}
