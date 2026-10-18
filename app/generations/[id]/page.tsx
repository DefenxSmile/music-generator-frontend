import Link from "next/link";
import { GenerationDetail } from "@/components/generation-detail";

export default function GenerationPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12">
      <p className="mb-4 text-sm">
        <Link href="/generations" className="text-text-muted hover:text-text-primary">
          Все песни
        </Link>
      </p>
      <GenerationDetail />
    </main>
  );
}
