"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { GenerationCard } from "@/components/generation-card";
import { useSessionStatus } from "@/components/session";
import { apiErrorMessage } from "@/lib/api/api-error";
import { listGenerations } from "@/lib/api/generations";
import { isActiveGenerationStatus } from "@/lib/generation-status";

export function GenerationList({ limit }: { limit?: number }) {
  const status = useSessionStatus();
  const query = useQuery({
    queryKey: ["generations"],
    queryFn: listGenerations,
    enabled: status === "authenticated",
    refetchInterval: (q) =>
      q.state.data?.some((item) => isActiveGenerationStatus(item.status)) ? 2000 : false,
  });

  if (status === "loading") {
    return <p className="text-sm text-text-muted">Проверяем вход…</p>;
  }

  if (status === "anonymous") {
    return (
      <p className="text-sm text-text-muted">
        <Link href="/auth/login" className="text-text-primary underline">
          Войдите
        </Link>
        , чтобы увидеть свои песни.
      </p>
    );
  }

  if (query.isPending) {
    return <p className="text-sm text-text-muted">Загружаем песни…</p>;
  }

  if (query.isError) {
    return <p className="text-sm text-text-primary">{apiErrorMessage(query.error)}</p>;
  }

  const items = limit ? query.data.slice(0, limit) : query.data;
  if (items.length === 0) {
    return (
      <p className="text-sm text-text-muted">
        Пока нет песен. Опишите идею на{" "}
        <Link href="/" className="text-text-primary underline">
          главной
        </Link>
        .
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((generation) => (
        <GenerationCard key={generation.id} generation={generation} linked />
      ))}
    </div>
  );
}
