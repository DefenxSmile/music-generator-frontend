import { SongComposer } from "@/components/song-composer";
import { GenerationList } from "@/components/generation-list";

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-16 pt-10 sm:pt-14">
      <div className="mb-10">
        <h1 className="lp-section-title text-center">Создать песню</h1>
        <p className="lp-body mx-auto mt-3 max-w-xl text-center">
          Опишите идею или вставьте свой текст. Получится одна песня с музыкой и русским вокалом.
        </p>
        <div className="mt-6">
          <SongComposer />
        </div>
      </div>
      <section className="mt-4">
        <h2 className="mb-3 text-sm font-semibold text-text-primary">Ваши песни</h2>
        <GenerationList limit={5} />
      </section>
    </main>
  );
}
