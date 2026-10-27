import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { GenerationDetail } from "@/components/song/generation-detail";
export default function GenerationSongPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-16 pt-6 sm:pt-10">
      <Link
        href="/generations"
        className="-ml-1 mb-6 inline-flex items-center gap-1 rounded-md px-1 py-1 text-sm text-text-muted transition-colors duration-150 hover:text-text-primary"
      >
        <ChevronLeft aria-hidden className="size-4" />
        Мои песни
      </Link>
      <Suspense fallback={null}>
        <GenerationDetail />
      </Suspense>
    </main>
  );
}
