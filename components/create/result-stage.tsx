"use client";

import { useQuery } from "@tanstack/react-query";
import {
  GenerationResult,
  GenerationResultSkeleton,
} from "@/components/create/generation-result";
import { DetailMessage } from "@/components/song/detail-message";
import { GenerationRow } from "@/components/song/generation-row";
import { GenerationRowsSkeleton } from "@/components/song/generation-rows-skeleton";
import { OpenSongButton } from "@/components/song/open-song-button";
import Button from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/empty-state";
import { useSessionStatus } from "@/hooks/use-session-status";
import { useSignedInHint } from "@/hooks/use-signed-in-hint";
import { apiErrorMessage } from "@/requests/api-error";
import {
  generationQueryOptions,
  generationsQueryOptions,
} from "@/requests/generations-query";
import { createWorkspaceHref } from "@/utils/generation-href";
import { isAuthenticated, isLoggedOut, isSessionLoading } from "@/utils/session-status";

const WORKSPACE_LIMIT = 12;

/** Create right pane: empty kit, recent rows, or the focused generation + player. */
export function ResultStage({ id = "" }: { id?: string }) {
  const status = useSessionStatus();
  const signedIn = useSignedInHint();
  const account = isAuthenticated(status);
  const list = useQuery(generationsQueryOptions(account && !id));
  const focused = useQuery(generationQueryOptions(id, account));

  if (!id && (isLoggedOut(status) || (isSessionLoading(status) && !signedIn))) {
    return (
      <EmptyState
        layout="panel"
        mark="slot"
        lead="Пока нет созданных песен"
        action={
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => document.getElementById("song-idea")?.focus()}
          >
            К идее
          </Button>
        }
      />
    );
  }

  if (id && (isLoggedOut(status) || (isSessionLoading(status) && !signedIn))) {
    return (
      <div className="flex flex-1 flex-col border-t border-overlay/8 p-4 sm:p-5">
        <DetailMessage text="Войдите, чтобы открыть песню.">
          <OpenSongButton next={createWorkspaceHref(id)} />
        </DetailMessage>
      </div>
    );
  }

  if (id) {
    if (isSessionLoading(status) || focused.isPending) {
      return (
        <div className="flex flex-1 flex-col border-t border-overlay/8 p-4 sm:p-5">
          <GenerationResultSkeleton />
        </div>
      );
    }
    if (focused.isError) {
      return (
        <div className="flex flex-1 flex-col border-t border-overlay/8 p-4 sm:p-5">
          <DetailMessage text={apiErrorMessage(focused.error)} />
        </div>
      );
    }
    return (
      <div className="flex flex-1 flex-col border-t border-overlay/8 p-4 sm:p-5">
        <GenerationResult generation={focused.data} />
      </div>
    );
  }

  if (isSessionLoading(status) || list.isPending) {
    return (
      <div className="flex flex-1 flex-col border-t border-overlay/8">
        <GenerationRowsSkeleton rows={3} />
      </div>
    );
  }

  if (list.isError) {
    return (
      <div className="flex flex-1 flex-col border-t border-overlay/8 p-4 sm:p-5">
        <DetailMessage text={apiErrorMessage(list.error)} />
      </div>
    );
  }

  const items = (list.data ?? []).slice(0, WORKSPACE_LIMIT);
  if (items.length === 0) {
    return (
      <EmptyState
        layout="panel"
        mark="slot"
        lead="Пока нет созданных песен"
        action={
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => document.getElementById("song-idea")?.focus()}
          >
            К идее
          </Button>
        }
      />
    );
  }

  return (
    <ul className="flex flex-1 flex-col divide-y divide-overlay/8 border-t border-overlay/8">
      {items.map((generation) => (
        <GenerationRow
          key={generation.id}
          generation={generation}
          href={createWorkspaceHref(generation.id)}
        />
      ))}
    </ul>
  );
}
