"use client";

export default function AppError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-16">
      <h1 className="lp-section-title">Не получилось открыть страницу</h1>
      <button type="button" onClick={reset} className="mt-4 text-sm text-text-primary underline">
        Повторить
      </button>
    </main>
  );
}
