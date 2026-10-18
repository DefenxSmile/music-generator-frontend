import Link from "next/link";
import { Suspense } from "react";
import { GenerationDetail } from "@/components/generation-detail";

export default function GenerationSongPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12">
      <p className="mb-4 text-sm">
        <Link href="/generations" className="text-text-muted hover:text-text-primary">
          Все песни
        </Link>
      </p>
      <Suspense fallback={<p className="text-sm text-text-muted">Загружаем песню…</p>}>
        <GenerationDetail />
      </Suspense>
    </main>
  );
}
