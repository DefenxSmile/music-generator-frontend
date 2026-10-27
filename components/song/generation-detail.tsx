"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { GenerationCard } from "@/components/song/generation-card";
import { useOpenAuth } from "@/components/auth/auth-dialog";
import { useSessionStatus } from "@/components/shell/session";
import Button from "@/components/ui/Button";
import { apiErrorMessage } from "@/lib/api/api-error";
import { fetchGeneration } from "@/lib/api/generations";
import { generationHref } from "@/lib/song/generation-href";
import { isActiveGenerationStatus } from "@/lib/song/generation-status";

export function GenerationDetail() {
  const id = useSearchParams().get("id")?.trim() ?? "";
  const status = useSessionStatus();
  const query = useQuery({
    queryKey: ["generation", id],
    queryFn: () => fetchGeneration(id),
    enabled: status === "authenticated" && Boolean(id),
    refetchInterval: (current) =>
      current.state.data && isActiveGenerationStatus(current.state.data.status) ? 2000 : false,
  });

  if (!id) {
    return <DetailMessage text="В ссылке нет песни." />;
  }

  if (status === "anonymous") {
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

  return (
    <GenerationCard generation={query.data} />
  );
}

function OpenSongButton({ next }: { next: string }) {
  const openAuth = useOpenAuth();
  return (
    <Button type="button" onClick={() => openAuth({ next })} variant="outline" size="sm">
      Войти
    </Button>
  );
}

function DetailMessage({ text, children }: { text: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border px-4 py-10 text-center">
      <p className="text-sm text-text-muted">{text}</p>
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}

function GenerationCardSkeleton() {
  return (
    <div aria-busy="true" aria-label="Загружаем песню">
      <span className="lp-skeleton block h-3 w-24" />
      <span className="lp-skeleton mt-4 block h-8 w-3/4" />
      <span className="lp-skeleton mt-3 block h-4 w-40" />
      <div className="mt-6 flex items-center gap-4 rounded-xl border border-border bg-bg-card p-4 sm:p-6">
        <span className="lp-skeleton size-16 shrink-0 rounded-xl sm:size-20" />
        <span className="lp-skeleton block h-12 flex-1" />
      </div>
    </div>
  );
}
