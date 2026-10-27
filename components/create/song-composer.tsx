"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { ComposerField } from "@/components/create/composer-field";
import { CreatePaywallDialog } from "@/components/create/create-paywall-dialog";
import { GenerateLyricsDialog } from "@/components/create/generate-lyrics-dialog";
import { FormMessage } from "@/components/ui/field";
import Button from "@/components/ui/Button";
import { useCreateGeneration } from "@/hooks/use-create-generation";
import { useOpenAuth } from "@/hooks/use-open-auth";
import { useSessionStatus } from "@/hooks/use-session-status";
import { useSongPlaceholder } from "@/hooks/use-song-placeholder";
import { apiErrorMessage, isApiError } from "@/requests/api-error";
import { generationQuoteQueryOptions } from "@/requests/billing-query";
import type { SongDraft } from "@/types/song-draft";
import { createWorkspaceHref } from "@/utils/generation-href";
import { PROMPT_MAX } from "@/utils/hero-idea";
import { rememberLead } from "@/utils/lead";
import { composePrompt, promptFits } from "@/utils/song-draft";

export function SongComposer({
  draft,
  onDraft,
}: {
  draft: SongDraft;
  onDraft: (draft: SongDraft) => void;
}) {
  const openAuth = useOpenAuth();
  const status = useSessionStatus();
  const placeholder = useSongPlaceholder();
  const [lyricsOpen, setLyricsOpen] = useState(false);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const lyricsButtonRef = useRef<HTMLButtonElement>(null);

  const quote = useQuery(generationQuoteQueryOptions(status === "authenticated"));
  const create = useCreateGeneration();
  const prompt = composePrompt(draft);
  const tooLong = prompt.length > PROMPT_MAX;

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = prompt.trim();
    if (!value || tooLong || status === "loading") return;
    if (status === "anonymous") {
      rememberLead("auth", null, value);
      openAuth({ intent: "create", next: createWorkspaceHref() });
      return;
    }
    if (!quote.data?.sufficient) {
      setPaywallOpen(true);
      return;
    }
    if (create.isPending) return;
    create.mutate(value);
  }

  function onGenerateLyrics() {
    if (status === "loading") return;
    if (status === "anonymous") {
      const idea = draft.idea.trim();
      rememberLead("auth", null, idea || undefined);
      openAuth({ next: createWorkspaceHref() });
      return;
    }
    setLyricsOpen(true);
  }

  function closeLyrics() {
    setLyricsOpen(false);
    lyricsButtonRef.current?.focus();
  }

  function onCommitLyrics(lyrics: string) {
    if (lyrics !== draft.lyrics) onDraft({ ...draft, lyrics });
    closeLyrics();
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  const inProgressId =
    create.isError &&
    isApiError(create.error) &&
    typeof create.error.details.generationId === "string"
      ? create.error.details.generationId
      : null;

  const canSubmit =
    promptFits(draft) &&
    status !== "loading" &&
    !create.isPending &&
    (status === "anonymous" || quote.isSuccess);

  return (
    <>
      <form onSubmit={onSubmit} className="flex flex-col gap-5 lg:min-h-0 lg:flex-1">
        <div className="flex flex-col gap-5 lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
          <ComposerField
            id="song-style"
            label="Стиль и идея"
            value={draft.idea}
            onChange={(idea) => onDraft({ ...draft, idea })}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            minHeightClass="min-h-32"
          />

          <ComposerField
            id="song-lyrics"
            label="Текст песни"
            value={draft.lyrics}
            onChange={(lyrics) => onDraft({ ...draft, lyrics })}
            onKeyDown={onKeyDown}
            placeholder="Оставьте пустым, слова напишет песня."
            minHeightClass="min-h-16"
            action={
              <Button
                ref={lyricsButtonRef}
                type="button"
                variant="outline"
                size="sm"
                onClick={onGenerateLyrics}
              >
                <Sparkles aria-hidden className="size-4" strokeWidth={1.75} />
                Сгенерировать текст
              </Button>
            }
          />

          {tooLong ? (
            <FormMessage>
              Стиль и текст вместе длиннее 2000 символов. Сократите один из них.
            </FormMessage>
          ) : null}
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
        </div>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={!canSubmit}
          className="min-h-12 w-full shrink-0"
        >
          {create.isPending ? "Отправляем…" : "Создать песню"}
        </Button>
      </form>
      <GenerateLyricsDialog
        open={lyricsOpen}
        lyrics={draft.lyrics}
        onClose={closeLyrics}
        onCommit={onCommitLyrics}
      />
      <CreatePaywallDialog open={paywallOpen} onClose={() => setPaywallOpen(false)} />
    </>
  );
}
