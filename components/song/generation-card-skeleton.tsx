export function GenerationCardSkeleton() {
  return (
    <article aria-busy="true" aria-label="Загружаем песню">
      <p className="lp-eyebrow invisible">Готово</p>
      <h1 className="lp-section-title mt-3 invisible">Песня</h1>
      <p className="mt-2 text-sm invisible">Дата</p>
      <div className="mt-6 flex items-center gap-4 rounded-xl border border-border bg-bg-card p-4 sm:p-6">
        <span className="lp-skeleton size-16 shrink-0 rounded-xl sm:size-20" />
        <span className="lp-skeleton block h-12 flex-1 rounded-md" />
      </div>
    </article>
  );
}
