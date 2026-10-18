import Link from "next/link";
import { GenerationPlayer } from "@/components/generation-player";
import { cn } from "@/lib/cn";
import { formatWhen } from "@/lib/format";
import { generationHref } from "@/lib/generation-href";
import { generationErrorLabel, generationStatusLabel } from "@/lib/generation-status";
import type { Generation } from "@/lib/api/generations";

export function GenerationCard({ generation, linked }: { generation: Generation; linked?: boolean }) {
  const created = formatWhen(generation.createdAt);
  const audioUntil = formatWhen(generation.audioUrlExpiresAt);
  const errorLabel = generationErrorLabel(generation.errorCode);
  const caption = generation.caption?.trim() ?? "";
  const title = caption || generation.prompt;

  return (
    <article className="rounded-2xl border border-border bg-bg-card p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className={cn("text-base font-semibold text-text-primary", linked && "line-clamp-3")}>
          {linked ? (
            <Link href={generationHref(generation.id)} className="hover:underline">
              {title}
            </Link>
          ) : (
            title
          )}
        </h2>
        <p className="text-sm text-text-muted">{generationStatusLabel(generation.status)}</p>
      </div>
      {created ? <p className="mt-1 text-xs text-text-dim">{created}</p> : null}
      {caption ? (
        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-text-muted">{generation.prompt}</p>
      ) : null}
      {!linked && generation.lyrics ? (
        <pre className="mt-4 whitespace-pre-wrap font-sans text-sm leading-relaxed text-text-primary">
          {generation.lyrics}
        </pre>
      ) : null}
      <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-dim">
        {generation.durationSeconds != null ? (
          <div>
            <dt className="inline">Длина </dt>
            <dd className="inline">{generation.durationSeconds} с</dd>
          </div>
        ) : null}
        {generation.vocalLanguage ? (
          <div>
            <dt className="inline">Вокал </dt>
            <dd className="inline">{generation.vocalLanguage}</dd>
          </div>
        ) : null}
        {generation.instrumental ? (
          <div>
            <dd>Без слов</dd>
          </div>
        ) : null}
      </dl>
      {errorLabel ? <p className="mt-3 text-sm text-text-primary">{errorLabel}</p> : null}
      {generation.audioUrl ? (
        <div className="mt-4">
          <GenerationPlayer src={generation.audioUrl} />
          <p className="mt-2 text-xs text-text-dim">
            Ссылка на аудио временная.
            {audioUntil ? ` Действует до ${audioUntil}.` : ""} Если плеер молчит, обновите страницу.
          </p>
        </div>
      ) : null}
    </article>
  );
}
