import { GenerationList } from "@/components/song/generation-list";
import Button from "@/components/ui/Button";

export default function GenerationsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-16 pt-10 sm:pt-14">
      <div className="flex items-end justify-between gap-4">
        <h1 className="lp-section-title">Мои песни</h1>
        <Button href="/create" variant="outline" size="sm">
          Новая песня
        </Button>
      </div>
      <div className="mt-6">
        <GenerationList />
      </div>
    </main>
  );
}
