import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-16">
      <h1 className="lp-section-title">Страница не найдена</h1>
      <p className="mt-4 text-sm text-text-muted">
        <Link href="/" className="text-text-primary underline">
          На главную
        </Link>
      </p>
    </main>
  );
}
