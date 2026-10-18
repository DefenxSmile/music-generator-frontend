import { GenerationList } from "@/components/generation-list";

export default function GenerationsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12">
      <h1 className="lp-section-title">Песни</h1>
      <div className="mt-6">
        <GenerationList />
      </div>
    </main>
  );
}
