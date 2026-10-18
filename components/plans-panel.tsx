"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useSessionStatus } from "@/components/session";
import { apiErrorMessage } from "@/lib/api/api-error";
import { fetchGenerationQuote } from "@/lib/api/billing";
import { creditsLabel } from "@/lib/credits";

export function PlansPanel() {
  const status = useSessionStatus();
  const quote = useQuery({
    queryKey: ["generation-quote"],
    queryFn: fetchGenerationQuote,
    enabled: status === "authenticated",
  });

  let line = "Войдите, чтобы увидеть, сколько кредитов стоит генерация. Оплата ещё не подключена.";
  if (status === "loading" || (status === "authenticated" && quote.isPending)) {
    line = "Смотрим стоимость генерации…";
  } else if (status === "authenticated" && quote.data) {
    line = `Генерация стоит ${creditsLabel(quote.data.cost)}. Оплата ещё не подключена.`;
  } else if (status === "authenticated" && quote.isError) {
    line = `${apiErrorMessage(quote.error)} Оплата ещё не подключена.`;
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12">
      <h1 className="lp-section-title">Тарифы</h1>
      <p className="mt-6 max-w-xl text-base leading-relaxed text-text-primary">{line}</p>
      {status === "anonymous" ? (
        <p className="mt-4 text-sm text-text-muted">
          <Link href="/auth/login?next=/plans" className="text-text-primary underline">
            Войти
          </Link>
        </p>
      ) : null}
    </main>
  );
}
