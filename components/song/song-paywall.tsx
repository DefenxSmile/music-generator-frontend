"use client";

import Button from "@/components/ui/Button";

/** Opens when the person tries to download. Listening stays available. Plans are on `/plans`; payment is not in Java yet. */
export function SongPaywall({ onClose }: { onClose: () => void }) {
  return (
    <section aria-labelledby="song-paywall-title" className="lp-hero-prompt mt-5 rounded-xl p-5 sm:p-6">
      <h2 id="song-paywall-title" className="text-lg font-semibold text-text-primary">
        Скачать песню
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-text-muted">
        Слушать можно сразу. Файл откроется после выбора тарифа.
      </p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <Button href="/plans" variant="primary" size="lg" className="w-full sm:w-auto">
          Выбрать тариф
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={onClose} className="w-full sm:w-auto">
          Продолжить слушать
        </Button>
      </div>
    </section>
  );
}
