"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { GenerationCard } from "@/components/generation-card";
import { useSessionStatus } from "@/components/session";
import { apiErrorMessage } from "@/lib/api/api-error";
import { fetchGeneration } from "@/lib/api/generations";
import { isActiveGenerationStatus } from "@/lib/generation-status";

export function GenerationDetail() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const status = useSessionStatus();
  const query = useQuery({
    queryKey: ["generation", id],
    queryFn: () => fetchGeneration(id),
    enabled: status === "authenticated" && Boolean(id),
    refetchInterval: (current) =>
      current.state.data && isActiveGenerationStatus(current.state.data.status) ? 2000 : false,
  });

  if (status === "loading") {
    return <p className="text-sm text-text-muted">Проверяем вход…</p>;
  }

  if (status === "anonymous") {
    return (
      <p className="text-sm text-text-muted">
        <Link href={`/auth/login?next=/generations/${id}`} className="text-text-primary underline">
          Войдите
        </Link>
        , чтобы открыть песню.
      </p>
    );
  }

  if (query.isPending) {
    return <p className="text-sm text-text-muted">Загружаем песню…</p>;
  }

  if (query.isError) {
    return <p className="text-sm text-text-primary">{apiErrorMessage(query.error)}</p>;
  }

  return <GenerationCard generation={query.data} />;
}
