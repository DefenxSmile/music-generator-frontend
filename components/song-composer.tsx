"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { FormMessage } from "@/components/field";
import { useMe, useSessionStatus } from "@/components/session";
import Button from "@/components/ui/Button";
import { apiErrorMessage, isApiError } from "@/lib/api/api-error";
import { fetchGenerationQuote } from "@/lib/api/billing";
import { createGeneration } from "@/lib/api/generations";
import { creditsLabel } from "@/lib/credits";
import { generationHref } from "@/lib/generation-href";
import { collapseIdea, persistHeroIdea, PROMPT_MAX, resolveInitialIdea } from "@/lib/hero-idea";

export function SongComposer() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const status = useSessionStatus();
  const me = useMe();
  const [prompt, setPrompt] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const initial = resolveInitialIdea(window.location.search);
    setPrompt(initial);
    if (initial) persistHeroIdea(initial);
    setReady(true);
  }, []);

  const quote = useQuery({
    queryKey: ["generation-quote"],
    queryFn: fetchGenerationQuote,
    enabled: status === "authenticated",
  });

  const create = useMutation({
    mutationFn: (value: string) => createGeneration(value, crypto.randomUUID()),
    onSuccess: async (generation) => {
      await queryClient.invalidateQueries({ queryKey: ["generations"] });
      await queryClient.invalidateQueries({ queryKey: ["generation-quote"] });
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      router.push(generationHref(generation.id));
    },
  });

  function onPromptChange(value: string) {
    const next = value.slice(0, PROMPT_MAX);
    setPrompt(next);
    persistHeroIdea(next);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = prompt.trim();
    if (!value || status === "loading") return;
    persistHeroIdea(value);
    if (status === "anonymous") {
      const idea = collapseIdea(value);
      router.push(idea ? `/auth/register?idea=${encodeURIComponent(idea)}` : "/auth/register");
      return;
    }
    if (!me.data?.emailVerified || !quote.data?.sufficient || create.isPending) return;
    create.mutate(value);
  }

  const inProgressId =
    create.isError && isApiError(create.error) && typeof create.error.details.generationId === "string"
      ? create.error.details.generationId
      : null;

  const canSubmit =
    ready &&
    prompt.trim().length > 0 &&
    status !== "loading" &&
    !create.isPending &&
    (status === "anonymous" || (me.data?.emailVerified === true && quote.data?.sufficient === true));

  return (
    <form onSubmit={onSubmit} className="mx-auto w-full max-w-xl text-left">
      <div className="lp-hero-prompt rounded-2xl p-3 sm:p-4">
        <label htmlFor="song-idea" className="sr-only">
          Идея песни
        </label>
        <textarea
          id="song-idea"
          name="idea"
          rows={4}
          maxLength={PROMPT_MAX}
          value={prompt}
          onChange={(event) => onPromptChange(event.target.value)}
          placeholder="Песня о нашей первой встрече летом…"
          autoComplete="off"
          className="block min-h-[5.5rem] w-full resize-none bg-transparent px-2 py-1.5 text-base leading-relaxed text-text-primary placeholder:text-text-muted focus:outline-none sm:min-h-[6.25rem] sm:text-[1.0625rem]"
        />
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <p className="order-2 px-1 text-xs leading-relaxed text-text-muted sm:order-1 sm:max-w-[16rem]">
            Обычными словами — как рассказываете другу
          </p>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={!canSubmit}
            className="order-1 min-h-12 w-full sm:order-2 sm:w-auto"
          >
            Создать песню
          </Button>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-2 px-1">
        {status === "authenticated" && quote.isPending ? (
          <p className="text-sm text-text-muted">Проверяем баланс…</p>
        ) : null}
        {quote.data ? (
          <p className="text-sm text-text-muted">
            На балансе {creditsLabel(quote.data.balance)}. Генерация стоит {creditsLabel(quote.data.cost)}.
          </p>
        ) : null}
        {status === "authenticated" && me.data?.emailVerified === false ? (
          <FormMessage>Сначала подтверди почту</FormMessage>
        ) : null}
        {quote.data && !quote.data.sufficient ? (
          <FormMessage>Кредита нет. Пополнения в API нет.</FormMessage>
        ) : null}
        {quote.isError ? <FormMessage>{apiErrorMessage(quote.error)}</FormMessage> : null}
        {create.isError ? (
          <FormMessage>
            {apiErrorMessage(create.error)}
            {inProgressId ? (
              <>
                {" "}
                <Link href={generationHref(inProgressId)} className="underline">
                  Открыть песню в работе
                </Link>
              </>
            ) : null}
          </FormMessage>
        ) : null}
      </div>
    </form>
  );
}
