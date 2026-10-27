"use client";

import { useQuery } from "@tanstack/react-query";
import { AnonymousSongs } from "@/components/song/anonymous-songs";
import { GenerationListBody } from "@/components/song/generation-list-body";
import { Section } from "@/components/ui/section";
import { useSessionStatus } from "@/hooks/use-session-status";
import { useSignedInHint } from "@/hooks/use-signed-in-hint";
import { generationsQueryOptions } from "@/requests/generations-query";
import { generationHref } from "@/utils/generation-href";

export function GenerationList({
  limit,
  hrefFor = generationHref,
  selectedId,
  authNext = "/generations",
  emptyAction = true,
  signIn = true,
}: {
  limit?: number;
  hrefFor?: (id: string) => string;
  selectedId?: string;
  authNext?: string;
  emptyAction?: boolean;
  signIn?: boolean;
}) {
  const status = useSessionStatus();
  const signedIn = useSignedInHint();
  const query = useQuery(generationsQueryOptions(status === "authenticated"));

  if (status === "anonymous" || (status === "loading" && !signedIn)) {
    return signIn ? (
      <AnonymousSongs next={authNext} />
    ) : (
      <p className="text-sm text-text-muted">Песни появятся здесь после входа.</p>
    );
  }

  return (
    <Section className="overflow-hidden">
      <GenerationListBody
        query={query}
        limit={limit}
        pending={status === "loading" || query.isPending}
        hrefFor={hrefFor}
        selectedId={selectedId}
        emptyAction={emptyAction}
      />
    </Section>
  );
}
