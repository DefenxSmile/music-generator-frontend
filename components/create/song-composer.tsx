"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useOpenAuth } from "@/components/auth/auth-dialog";
import { useEffect, useState, type FormEvent } from "react";
import { FormMessage } from "@/components/ui/field";
import { useSessionStatus } from "@/components/shell/session";
import Button from "@/components/ui/Button";
import { apiErrorMessage, isApiError } from "@/lib/api/api-error";
import { fetchGenerationQuote } from "@/lib/api/billing";
import { createGeneration } from "@/lib/api/generations";
import { creditsLabel } from "@/lib/credits";
import { createWorkspaceHref } from "@/lib/song/generation-href";
import { persistHeroIdea, PROMPT_MAX } from "@/lib/lead/hero-idea";
import { rememberLead } from "@/lib/lead/lead";
import { readSongFor, songForPlaceholder } from "@/lib/lead/qualification";

export function SongComposer({ initialIdea }: { initialIdea: string }) {
  const router = useRouter();
  const openAuth = useOpenAuth();
  const queryClient = useQueryClient();
  const status = useSessionStatus();
  const [prompt, setPrompt] = useState(initialIdea);
  const [placeholder, setPlaceholder] = useState("Песня о нашей первой встрече летом…");

  useEffect(() => {
    setPlaceholder(songForPlaceholder(readSongFor()));
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
      rememberLead("generation");
      router.replace(createWorkspaceHref(generation.id));
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
      rememberLead("auth");
      openAuth({ intent: "create", next: createWorkspaceHref() });
      return;
    }
    if (!quote.data?.sufficient || create.isPending) return;
    create.mutate(value);
  }

  const inProgressId =
    create.isError && isApiError(create.error) && typeof create.error.details.generationId === "string"
      ? create.error.details.generationId
      : null;

  const canSubmit =
    prompt.trim().length > 0 &&
    status !== "loading" &&
    !create.isPending &&
    (status === "anonymous" || quote.data?.sufficient === true);

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <label htmlFor="song-draft" className="sr-only">
        Идея
      </label>
      <textarea
        id="song-draft"
        name="idea"
        maxLength={PROMPT_MAX}
        value={prompt}
        onChange={(event) => onPromptChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
            event.preventDefault();
            event.currentTarget.form?.requestSubmit();
          }
        }}
        placeholder={placeholder}
        autoComplete="off"
        className="h-44 w-full resize-none rounded-lg border border-overlay/10 bg-bg-card px-3.5 py-3.5 text-[0.9375rem] leading-relaxed text-text-primary shadow-[inset_0_1px_0_color-mix(in_srgb,var(--color-overlay)_4%,transparent)] placeholder:text-text-muted focus:border-overlay/20 focus:outline-none"
      />
      {quote.data && !quote.data.sufficient ? <FormMessage>На балансе нет кредитов для песни.</FormMessage> : null}
      {quote.isError ? <FormMessage>{apiErrorMessage(quote.error)}</FormMessage> : null}
      {create.isError ? (
        <FormMessage>
          {apiErrorMessage(create.error)}
          {inProgressId ? (
            <>
              {" "}
              <Link href={createWorkspaceHref(inProgressId)} className="underline">
                Открыть песню в работе
              </Link>
            </>
          ) : null}
        </FormMessage>
      ) : null}
      <Button type="submit" variant="primary" size="lg" disabled={!canSubmit} className="min-h-12 w-full">
        {create.isPending ? "Отправляем…" : "Создать песню"}
      </Button>
      <p className="px-1 text-xs leading-relaxed text-text-dim">
        Музыку и русский вокал соберём сами.
        {quote.data?.sufficient ? ` Песня спишет ${creditsLabel(quote.data.cost)}.` : ""}
      </p>
    </form>
  );
}
