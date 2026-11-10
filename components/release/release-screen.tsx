"use client";

import { ChevronLeft, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { PlatformPicker } from "@/components/release/platform-picker";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { MediaFrame } from "@/components/ui/media-frame";
import { Section } from "@/components/ui/section";
import {
  emptyReleaseDraft,
  listReleaseDrafts,
  readReleaseDraft,
  removeReleaseDraft,
  saveReleaseDraft,
  type ReleaseDraft,
} from "@/utils/release-draft";

type View = { kind: "list" } | { kind: "edit"; draft: ReleaseDraft };

function formatUpdated(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
}

export function ReleaseScreen() {
  const [view, setView] = useState<View>({ kind: "list" });
  const [drafts, setDrafts] = useState<ReleaseDraft[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setDrafts(listReleaseDrafts());
    setHydrated(true);
  }, []);

  function openNew() {
    setView({ kind: "edit", draft: emptyReleaseDraft() });
  }

  function openDraft(id: string) {
    const draft = readReleaseDraft(id);
    if (!draft) return;
    setView({ kind: "edit", draft });
  }

  function persist(next: ReleaseDraft) {
    saveReleaseDraft(next);
    setDrafts(listReleaseDrafts());
    setView({ kind: "edit", draft: next });
  }

  function remove(id: string) {
    removeReleaseDraft(id);
    setDrafts(listReleaseDrafts());
    setView({ kind: "list" });
  }

  if (!hydrated) {
    return <main className="min-h-[50dvh]" />;
  }

  if (view.kind === "edit") {
    return (
      <ReleaseEditor
        draft={view.draft}
        onChange={persist}
        onBack={() => {
          setDrafts(listReleaseDrafts());
          setView({ kind: "list" });
        }}
        onRemove={() => remove(view.draft.id)}
      />
    );
  }

  return (
    <main className="px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary">Релиз</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-text-muted">
            Готовую песню — на площадки. Обложка и видео появятся позже; сейчас можно собрать
            черновик.
          </p>
        </header>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <button
            type="button"
            onClick={openNew}
            className="flex min-h-[13.5rem] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-overlay/20 bg-transparent px-4 text-sm text-text-muted transition-colors duration-150 hover:border-overlay/35 hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <span className="grid size-10 place-items-center rounded-full border border-overlay/15">
              <Plus aria-hidden className="size-4" strokeWidth={1.75} />
            </span>
            Новый релиз
          </button>

          {drafts.map((draft) => {
            const title = draft.title.trim() || "Черновик";
            const count = draft.platformIds.length;
            return (
              <button
                key={draft.id}
                type="button"
                onClick={() => openDraft(draft.id)}
                className="flex min-h-[13.5rem] flex-col rounded-xl border border-overlay/10 bg-bg-card p-4 text-left transition-colors duration-150 hover:border-overlay/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <MediaFrame toneId={draft.id} className="aspect-square w-full" />
                <span className="mt-4 text-[11px] font-medium uppercase tracking-[0.14em] text-text-dim">
                  Черновик
                </span>
                <span className="mt-1 truncate text-base font-medium text-text-primary">
                  {title}
                </span>
                <span className="mt-1 text-xs text-text-muted">
                  {count} площад{count === 1 ? "ка" : count >= 2 && count <= 4 ? "ки" : "ок"}
                  {draft.updatedAt ? ` · ${formatUpdated(draft.updatedAt)}` : ""}
                </span>
              </button>
            );
          })}
        </div>

        {drafts.length === 0 ? (
          <p className="text-sm text-text-dim">
            Пока пусто. Соберите черновик или сначала{" "}
            <a
              href="/create"
              className="text-text-muted underline-offset-2 hover:text-text-primary hover:underline"
            >
              создайте песню
            </a>
            .
          </p>
        ) : null}
      </div>
    </main>
  );
}

function ReleaseEditor({
  draft,
  onChange,
  onBack,
  onRemove,
}: {
  draft: ReleaseDraft;
  onChange: (draft: ReleaseDraft) => void;
  onBack: () => void;
  onRemove: () => void;
}) {
  const title = draft.title.trim() || "Без названия";

  function patch(partial: Partial<ReleaseDraft>) {
    onChange({ ...draft, ...partial });
  }

  return (
    <main className="px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1 rounded-lg py-1.5 pr-2.5 pl-1.5 text-sm text-text-dim transition-colors duration-150 hover:bg-overlay/10 hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <ChevronLeft aria-hidden className="size-4" strokeWidth={1.75} />К списку
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="rounded-lg px-2.5 py-1.5 text-sm text-text-dim transition-colors duration-150 hover:bg-overlay/10 hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Удалить черновик
          </button>
        </div>

        <Section className="p-4 sm:p-5">
          <div className="flex gap-4">
            <MediaFrame toneId={draft.id} className="size-24 shrink-0 sm:size-28" />
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-text-dim">
                Сингл · Черновик
              </p>
              <p className="mt-2 truncate text-xl font-semibold tracking-tight text-text-primary">
                {title}
              </p>
              <p className="mt-1 truncate text-sm text-text-muted">
                {draft.artist.trim() || "Исполнитель не указан"}
              </p>
              <p className="mt-3 text-xs text-text-dim">
                Обложка появится в следующей итерации. Сейчас — цветной кадр песни.
              </p>
            </div>
          </div>
        </Section>

        <Section className="p-4 sm:p-5">
          <h2 className="text-sm font-medium text-text-primary">Песня и данные</h2>
          <p className="mt-1 text-xs leading-relaxed text-text-dim">
            Аудио берётся из готовой песни в сервисе. Файл отдельно загружать не нужно.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-xs font-medium text-text-dim">Название</span>
              <Input
                value={draft.title}
                onChange={(event) => patch({ title: event.target.value })}
                placeholder="Как на площадках"
                autoComplete="off"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-text-dim">Исполнитель</span>
              <Input
                value={draft.artist}
                onChange={(event) => patch({ artist: event.target.value })}
                placeholder="Псевдоним"
                autoComplete="off"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-text-dim">Дата релиза</span>
              <Input
                type="date"
                value={draft.date}
                onChange={(event) => patch({ date: event.target.value })}
              />
            </label>
          </div>
          <div className="mt-4">
            <Button href="/create" variant="outline" size="sm">
              Выбрать песню на создании
            </Button>
          </div>
        </Section>

        <Section className="p-4 sm:p-5">
          <PlatformPicker
            selectedIds={draft.platformIds}
            onChange={(platformIds) => patch({ platformIds })}
          />
        </Section>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-relaxed text-text-dim">
            Отправка на модерацию появится, когда дистрибуция подключится в Java. Черновик уже
            сохраняется в этом браузере.
          </p>
          <Button type="button" variant="primary" size="lg" disabled className="min-h-12 shrink-0">
            Отправить
          </Button>
        </div>
      </div>
    </main>
  );
}
