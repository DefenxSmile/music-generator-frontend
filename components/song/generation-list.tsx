"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { GenerationRow, GenerationRowsSkeleton } from "@/components/song/generation-row";
import { useOpenAuth } from "@/components/auth/auth-dialog";
import { useSessionStatus } from "@/components/shell/session";
import Button from "@/components/ui/Button";
import { apiErrorMessage } from "@/lib/api/api-error";
import { listGenerations, type Generation } from "@/lib/api/generations";
import { createWorkspaceHref, generationHref } from "@/lib/song/generation-href";
import { isActiveGenerationStatus } from "@/lib/song/generation-status";

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
  const query = useQuery({
    queryKey: ["generations"],
    queryFn: listGenerations,
    enabled: status === "authenticated",
    refetchInterval: (q) =>
      q.state.data?.some((item) => isActiveGenerationStatus(item.status)) ? 2000 : false,
  });

  if (status === "anonymous") {
    return signIn ? <AnonymousSongs next={authNext} /> : <p className="text-sm text-text-muted">Песни появятся здесь после входа.</p>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-bg-card">
      <GenerationListBody
        query={query}
        limit={limit}
        pending={status === "loading" || query.isPending}
        hrefFor={hrefFor}
        selectedId={selectedId}
        emptyAction={emptyAction}
      />
    </div>
  );
}

function AnonymousSongs({ next }: { next: string }) {
  const openAuth = useOpenAuth();
  return (
    <div className="rounded-xl border border-border px-4 py-8 text-center">
      <p className="text-sm text-text-muted">Песни появятся здесь после входа.</p>
      <Button type="button" onClick={() => openAuth({ next })} variant="outline" size="sm" className="mt-4">
        Войти
      </Button>
    </div>
  );
}

function GenerationListBody({
  query,
  limit,
  pending,
  hrefFor,
  selectedId,
  emptyAction,
}: {
  query: UseQueryResult<Generation[]>;
  limit?: number;
  pending: boolean;
  hrefFor: (id: string) => string;
  selectedId?: string;
  emptyAction: boolean;
}) {
  if (pending) return <GenerationRowsSkeleton rows={limit ? Math.min(limit, 3) : 3} />;

  if (query.isError) {
    return <p className="px-4 py-6 text-sm text-text-primary">{apiErrorMessage(query.error)}</p>;
  }

  const items = (query.data ?? []).slice(0, limit);
  if (items.length === 0) {
    return (
      <div className="px-4 py-8 text-center">
        <p className="text-sm text-text-muted">Пока ни одной песни. Первая начинается с идеи.</p>
        {emptyAction ? (
          <Button href={createWorkspaceHref()} variant="outline" size="sm" className="mt-4">
            Создать песню
          </Button>
        ) : null}
      </div>
    );
  }

  return (
    <ul className="divide-y divide-border">
      {items.map((generation) => (
        <GenerationRow
          key={generation.id}
          generation={generation}
          href={hrefFor(generation.id)}
          selected={generation.id === selectedId}
        />
      ))}
    </ul>
  );
}
