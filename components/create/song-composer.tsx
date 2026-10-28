"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { ComposerField } from "@/components/create/composer-field";
import { CreatePaywallDialog } from "@/components/create/create-paywall-dialog";
import { LyricsPrompt } from "@/components/create/lyrics-prompt";
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
  onPreview,
  previewBusy = false,
}: {
  draft: SongDraft;
  onDraft: (draft: SongDraft) => void;
  /** Local preview of the wait and the two variants. Skips the quote and Java. */
  onPreview?: (draft: SongDraft) => void;
  previewBusy?: boolean;
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
    if (onPreview) {
      onPreview(draft);
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
    setLyricsOpen((current) => !current);
  }

  function closeLyrics() {
    setLyricsOpen(false);
    lyricsButtonRef.current?.focus();
  }

  function onPromptLyrics(line: string) {
    const base = draft.lyrics.trim();
    const next = !base || base === line ? line : `${base}\n\n${line}`;
    if (next !== draft.lyrics) onDraft({ ...draft, lyrics: next });
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
    !previewBusy &&
    !create.isPending &&
    (Boolean(onPreview) || status === "anonymous" || quote.isSuccess);

  return (
    <>
      <form onSubmit={onSubmit} className="lp-composer flex min-h-0 flex-1 flex-col">
        <div className="flex min-h-0 flex-1 flex-col rounded-xl border border-overlay/10 bg-bg-card transition-colors duration-150 focus-within:border-overlay/24">
          <div className="lp-composer-fields flex min-h-0 flex-col overflow-y-auto">
            <ComposerField
              id="song-style"
              label="Стиль и идея"
              value={draft.idea}
              onChange={(idea) => onDraft({ ...draft, idea })}
              onKeyDown={onKeyDown}
              placeholder={placeholder}
              minHeightClass="min-h-32"
            />

            <div className="relative border-t border-overlay/10" data-lyrics-field="">
              <ComposerField
                id="song-lyrics"
                label="Текст песни"
                value={draft.lyrics}
                onChange={(lyrics) => onDraft({ ...draft, lyrics })}
                onKeyDown={onKeyDown}
                placeholder="Оставьте пустым, слова напишет песня."
                minHeightClass="min-h-16"
                footer={
                  <div aria-hidden data-open={lyricsOpen ? "true" : "false"} className="lp-lyrics-space" />
                }
                action={
                  <Button
                    ref={lyricsButtonRef}
                    type="button"
                    variant="outline"
                    size="sm"
                    data-lyrics-prompt-toggle=""
                    aria-expanded={lyricsOpen}
                    onClick={onGenerateLyrics}
                  >
                    Сгенерировать текст
                  </Button>
                }
              />
              <LyricsPrompt open={lyricsOpen} onClose={closeLyrics} onSubmit={onPromptLyrics} />
            </div>
          </div>

          <div className="lp-composer-actions flex shrink-0 flex-col gap-3 px-3.5 py-4">
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
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={!canSubmit}
              className="min-h-12 shrink-0"
            >
              {previewBusy ? "Собираем…" : create.isPending ? "Отправляем…" : "Создать песню"}
            </Button>
          </div>
          </div>
          <div aria-hidden className="min-h-0 flex-1" />
        </div>
      </form>
      <CreatePaywallDialog open={paywallOpen} onClose={() => setPaywallOpen(false)} />
    </>
  );
}
