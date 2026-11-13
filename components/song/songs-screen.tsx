"use client";

import { useQuery } from "@tanstack/react-query";
import { GenerationList } from "@/components/song/generation-list";
import { EmptyState } from "@/components/ui/empty-state";
import Button from "@/components/ui/Button";
import { useOpenAuth } from "@/hooks/use-open-auth";
import { useSessionStatus } from "@/hooks/use-session-status";
import { useSignedInHint } from "@/hooks/use-signed-in-hint";
import { generationsQueryOptions } from "@/requests/generations-query";
import { isAuthenticated, isLoggedOut, isSessionLoading } from "@/utils/session-status";

export function SongsScreen() {
  const openAuth = useOpenAuth();
  const status = useSessionStatus();
  const signedIn = useSignedInHint();
  const query = useQuery(generationsQueryOptions(isAuthenticated(status)));
  const anonymous = isLoggedOut(status) || (isSessionLoading(status) && !signedIn);
  const empty = isAuthenticated(status) && query.isSuccess && query.data.length === 0;

  if (anonymous) {
    return (
      <main>
        <EmptyState
          title="Мои песни"
          lead="Песни появятся здесь после входа."
          mark="slot"
          action={
            <Button type="button" variant="outline" onClick={() => openAuth()}>
              Войти
            </Button>
          }
        />
      </main>
    );
  }

  if (empty) {
    return (
      <main>
        <EmptyState
          title="Мои песни"
          lead="Пока ни одной песни."
          mark="slot"
          action={
            <Button href="/create" variant="outline">
              Создать песню
            </Button>
          }
        />
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
