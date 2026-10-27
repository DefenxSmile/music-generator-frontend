"use client";

import { useQuery } from "@tanstack/react-query";
import { Music2 } from "lucide-react";
import { GenerationList } from "@/components/song/generation-list";
import { EmptyState } from "@/components/ui/empty-state";
import Button from "@/components/ui/Button";
import { useSessionStatus } from "@/hooks/use-session-status";
import { useSignedInHint } from "@/hooks/use-signed-in-hint";
import { generationsQueryOptions } from "@/requests/generations-query";

export function SongsScreen() {
  const status = useSessionStatus();
  const signedIn = useSignedInHint();
  const query = useQuery(generationsQueryOptions(status === "authenticated"));
  const anonymous = status === "anonymous" || (status === "loading" && !signedIn);
  const empty = status === "authenticated" && query.isSuccess && query.data.length === 0;

  if (anonymous) {
    return (
      <main>
        <EmptyState title="Мои песни" lead="Песни появятся здесь после входа." icon={Music2} />
      </main>
    );
  }

  if (empty) {
    return (
      <main>
        <EmptyState title="Мои песни" lead="Пока ни одной песни." icon={Music2} />
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-16 pt-10 sm:pt-14">
      <div className="flex items-end justify-between gap-4">
        <h1 className="lp-section-title">Мои песни</h1>
        <Button href="/create" variant="outline" size="sm">
          Новая песня
        </Button>
      </div>
      <div className="mt-6">
        <GenerationList />
      </div>
    </main>
  );
}
