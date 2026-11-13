"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { AdvancedOptions } from "@/components/create/advanced-options";
import { ComposerField } from "@/components/create/composer-field";
import { ComposerModeToggle } from "@/components/create/composer-mode-toggle";
import { ComposerSection } from "@/components/create/composer-section";
import { CreatePaywallDialog } from "@/components/create/create-paywall-dialog";
import { LyricsPrompt } from "@/components/create/lyrics-prompt";
import { StyleField } from "@/components/create/style-field";
import { FormMessage } from "@/components/ui/field";
import Button from "@/components/ui/Button";
import { Section } from "@/components/ui/section";
import { useCreateGeneration } from "@/hooks/use-create-generation";
import { useOpenAuth } from "@/hooks/use-open-auth";
import { useSessionStatus } from "@/hooks/use-session-status";
import { useSongPlaceholder } from "@/hooks/use-song-placeholder";
import { apiErrorMessage, isApiError } from "@/requests/api-error";
import { generationQuoteQueryOptions } from "@/requests/billing-query";
import type { SongDraft } from "@/types/song-draft";
import {
  persistComposerMode,
  readComposerMode,
  resolveComposerMode,
  type ComposerMode,
} from "@/utils/composer-mode";
import { createWorkspaceHref } from "@/utils/generation-href";
import { PROMPT_MAX } from "@/utils/hero-idea";
import { rememberLead } from "@/utils/lead";
import { shouldOpenPaywall } from "@/utils/paywall";
import { isAuthenticated, isLoggedOut, isSessionLoading } from "@/utils/session-status";
import { composePrompt, promptFits } from "@/utils/song-draft";
import { cn } from "@/utils/cn";

function previewLine(value: string, empty: string): string {
  const line = value.replace(/\r\n/g, "\n").trim().split("\n")[0]?.trim() ?? "";
  return line || empty;
}

export function SongComposer({
  draft,
  onDraft,
  generationBusy = false,
}: {
  draft: SongDraft;
  onDraft: (draft: SongDraft) => void;
  /** True while the open generation is still writing/running — block a second create. */
  generationBusy?: boolean;
}) {
  const openAuth = useOpenAuth();
  const status = useSessionStatus();
  const placeholder = useSongPlaceholder();
  const [lyricsOpen, setLyricsOpen] = useState(false);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [mode, setMode] = useState<ComposerMode>("simple");
  const [ideaOpen, setIdeaOpen] = useState(true);
  const [styleOpen, setStyleOpen] = useState(true);
  const [lyricsSectionOpen, setLyricsSectionOpen] = useState(false);
  const lyricsButtonRef = useRef<HTMLButtonElement>(null);
  const modeReady = useRef(false);

  const quote = useQuery(generationQuoteQueryOptions(isAuthenticated(status)));
  const create = useCreateGeneration();
  const prompt = composePrompt(draft);
  const tooLong = prompt.length > PROMPT_MAX;
  const advanced = mode === "advanced";

  useEffect(() => {
    if (!modeReady.current) {
      modeReady.current = true;
      const next = resolveComposerMode(draft.lyrics, readComposerMode());
      setMode(next);
      if (next === "advanced" && draft.lyrics.trim()) setLyricsSectionOpen(true);
      return;
    }
    if (draft.lyrics.trim()) {
      setMode("advanced");
      setLyricsSectionOpen(true);
    }
  }, [draft.lyrics]);

  function onModeChange(next: ComposerMode) {
    setMode(next);
    persistComposerMode(next);
    if (next === "advanced") {
      setIdeaOpen(true);
      setStyleOpen(true);
    } else {
      setLyricsOpen(false);
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = prompt.trim();
    if (!value || tooLong || isSessionLoading(status) || generationBusy) return;
    if (isLoggedOut(status)) {
      rememberLead("auth", null, value);
      openAuth({ intent: "create", next: createWorkspaceHref() });
      return;
    }
    if (!quote.data?.sufficient) {
      setPaywallOpen(true);
      return;
    }
    if (create.isPending) return;
    create.mutate(value, {
      onError: (error) => {
        if (shouldOpenPaywall(error)) setPaywallOpen(true);
      },
    });
  }

  function onGenerateLyrics() {
    if (isSessionLoading(status)) return;
    if (isLoggedOut(status)) {
      const idea = draft.idea.trim();
      rememberLead("auth", null, idea || undefined);
      openAuth({ next: createWorkspaceHref() });
      return;
    }
    setLyricsSectionOpen(true);
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
    !isSessionLoading(status) &&
    !create.isPending &&
    !generationBusy &&
    (isLoggedOut(status) || quote.isSuccess);

  return (
    <>
      <form onSubmit={onSubmit} className="lp-composer flex min-h-0 flex-1 flex-col gap-3">
        <ComposerModeToggle value={mode} onChange={onModeChange} />

        <Section className="flex min-h-0 flex-1 flex-col border-overlay/8">
          <div className="lp-composer-fields flex min-h-0 max-h-full flex-col divide-y divide-overlay/6 overflow-y-auto">
            {advanced ? (
              <ComposerSection
                title="О чём песня"
                open={ideaOpen}
                onOpenChange={setIdeaOpen}
                summary={previewLine(draft.idea, "Добавьте идею")}
                hero
              >
                <ComposerField
                  id="song-idea"
                  label="О чём песня"
                  value={draft.idea}
                  onChange={(idea) => onDraft({ ...draft, idea })}
                  onKeyDown={onKeyDown}
                  placeholder={placeholder}
                  minHeightClass="min-h-28"
                  hideLabel
                />
              </ComposerSection>
            ) : (
              <div className="lp-composer-idea px-3.5 py-3">
                <p className="lp-kicker">О чём песня</p>
                <ComposerField
                  id="song-idea"
                  label="О чём песня"
                  value={draft.idea}
                  onChange={(idea) => onDraft({ ...draft, idea })}
                  onKeyDown={onKeyDown}
                  placeholder={placeholder}
                  minHeightClass="min-h-32"
                  hideLabel
                />
              </div>
            )}

            {advanced ? (
              <ComposerSection
                title="Стили"
                open={styleOpen}
                onOpenChange={setStyleOpen}
                summary={previewLine(draft.style, "Поп, баллада, гитара…")}
              >
                <StyleField
                  value={draft.style}
                  onChange={(style) => onDraft({ ...draft, style })}
                  onKeyDown={onKeyDown}
                  hideLabel
                />
              </ComposerSection>
            ) : (
              <StyleField
                value={draft.style}
                onChange={(style) => onDraft({ ...draft, style })}
                onKeyDown={onKeyDown}
              />
            )}

            {advanced ? (
              <>
                <div className="relative" data-lyrics-field="">
                  <ComposerSection
                    title="Текст песни"
                    open={lyricsSectionOpen}
                    onOpenChange={setLyricsSectionOpen}
                    summary={previewLine(draft.lyrics, "Слова напишет песня")}
                  >
                    <ComposerField
                      id="song-lyrics"
                      label="Текст песни"
                      value={draft.lyrics}
                      onChange={(lyrics) => onDraft({ ...draft, lyrics })}
                      onKeyDown={onKeyDown}
                      placeholder="Оставьте пустым, слова напишет песня."
                      minHeightClass="min-h-16"
                      maxHeightClass="max-h-48"
                      hideLabel
                      footer={
                        <div
                          aria-hidden
                          data-open={lyricsOpen ? "true" : "false"}
                          className="lp-lyrics-space"
                        />
                      }
                      action={
                        <Button
                          ref={lyricsButtonRef}
                          type="button"
                          variant="quiet"
                          size="sm"
                          data-lyrics-prompt-toggle=""
                          aria-expanded={lyricsOpen}
                          onClick={onGenerateLyrics}
                        >
                          Сгенерировать текст
                        </Button>
                      }
                    />
                  </ComposerSection>
                  <LyricsPrompt open={lyricsOpen} onClose={closeLyrics} onSubmit={onPromptLyrics} />
                </div>

                <AdvancedOptions
                  vocalGender={draft.vocalGender}
                  onVocalGender={(vocalGender) => onDraft({ ...draft, vocalGender })}
                />
              </>
            ) : null}
          </div>

          <div aria-hidden className="min-h-0 flex-1" />

          <div
            className={cn(
              "lp-composer-actions flex shrink-0 flex-col gap-3 border-t border-overlay/8 px-3.5 py-3",
            )}
          >
            {tooLong ? (
              <FormMessage>
                Стиль, идея и текст вместе длиннее 2000 символов. Сократите один из них.
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
                {create.isPending
                  ? "Отправляем…"
                  : generationBusy
                    ? "Песня в работе…"
                    : "Создать песню"}
              </Button>
            </div>
          </div>
        </Section>
      </form>
      <CreatePaywallDialog open={paywallOpen} onClose={() => setPaywallOpen(false)} />
    </>
  );
}
