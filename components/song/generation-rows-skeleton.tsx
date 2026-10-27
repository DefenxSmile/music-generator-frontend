export function GenerationRowsSkeleton({ rows = 1 }: { rows?: number }) {
  return (
    <ul aria-busy="true" aria-label="Загружаем песни" className="divide-y divide-border">
      {Array.from({ length: rows }, (_, index) => (
        <li key={index} className="flex items-center gap-3 px-3 py-3 sm:gap-4 sm:px-4">
          <span className="lp-skeleton size-11 shrink-0 rounded-lg" />
          <span className="min-w-0 flex-1">
            <span className="lp-skeleton block h-[1.40625rem] w-2/5 rounded-md" />
            <span className="lp-skeleton mt-0.5 block h-[1.125rem] w-1/4 rounded-md" />
          </span>
          <span aria-hidden className="size-4 shrink-0" />
        </li>
      ))}
    </ul>
  );
}
