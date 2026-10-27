"use client";

import type { UseQueryResult } from "@tanstack/react-query";
import { GenerationRow } from "@/components/song/generation-row";
import { GenerationRowsSkeleton } from "@/components/song/generation-rows-skeleton";
import Button from "@/components/ui/Button";
import { apiErrorMessage } from "@/requests/api-error";
import type { Generation } from "@/types/generation";
import { createWorkspaceHref } from "@/utils/generation-href";

export function GenerationListBody({
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
  if (pending) return <GenerationRowsSkeleton rows={limit ? Math.min(limit, 1) : 1} />;

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
