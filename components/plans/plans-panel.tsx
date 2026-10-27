"use client";

import { useQuery } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { useState } from "react";
import { useOpenAuth } from "@/components/auth/auth-dialog";
import { useSessionStatus } from "@/components/shell/session";
import Button from "@/components/ui/Button";
import { apiErrorMessage } from "@/lib/api/api-error";
import { fetchGenerationQuote } from "@/lib/api/billing";
import { cn } from "@/lib/cn";
import { creditsLabel } from "@/lib/credits";
import { PRICING_PLANS } from "@/lib/plans/pricing-plans";

export function PlansPanel() {
  const status = useSessionStatus();
  const openAuth = useOpenAuth();
  const [chosenId, setChosenId] = useState<string | null>(null);
  const quote = useQuery({
    queryKey: ["generation-quote"],
    queryFn: fetchGenerationQuote,
    enabled: status === "authenticated",
  });

  function choose(id: string) {
    if (status === "anonymous") {
      openAuth({ next: "/plans" });
      return;
    }
    setChosenId(id);
  }

  return (
    <main className="relative px-4 pb-16 pt-10 sm:pt-14">
      <div aria-hidden className="lp-stage-wash pointer-events-none absolute inset-x-0 top-0 h-[min(100dvh,52rem)]" />
      <div className="relative mx-auto w-full max-w-5xl">
      <h1 className="lp-section-title text-text-primary">Тарифы</h1>
      <p className="lp-body mt-2 max-w-xl">Платите за генерации, а не за подписку на год. Начните с одной песни.</p>
      {status === "authenticated" && quote.data ? (
        <p className="mt-3 text-sm text-text-dim">На балансе {creditsLabel(quote.data.balance)}.</p>
      ) : null}
      {status === "authenticated" && quote.isError ? (
        <p className="mt-3 text-sm text-text-primary">{apiErrorMessage(quote.error)}</p>
      ) : null}

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {PRICING_PLANS.map((plan) => {
          const chosen = chosenId === plan.id;
          return (
            <article
              key={plan.id}
              className={cn(
                "flex flex-col rounded-xl border bg-bg-card p-5 sm:p-6",
                plan.highlighted ? "border-accent/60 shadow-accent-card" : "border-border",
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-base font-medium text-text-primary">{plan.name}</h2>
                {plan.highlighted ? (
                  <span className="shrink-0 rounded-full bg-accent/15 px-2 py-0.5 text-[0.65rem] tracking-[0.08em] text-accent uppercase">
                    Популярный
                  </span>
                ) : null}
              </div>
              <p className="mt-4 flex flex-wrap items-baseline gap-x-2">
                <span className="text-3xl font-semibold tracking-tight text-text-primary">{plan.price}</span>
                <span className="text-sm text-text-dim">{plan.priceNote}</span>
              </p>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">{plan.description}</p>
              <ul className="mt-4 flex-1 space-y-2 border-t border-border pt-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-accent/70" strokeWidth={1.75} />
                    <span className="text-sm leading-relaxed text-text-muted">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5">
                <Button
                  type="button"
                  variant={plan.highlighted ? "primary" : "outline"}
                  size="lg"
                  className="w-full"
                  onClick={() => choose(plan.id)}
                >
                  {chosen ? "Тариф выбран" : "Выбрать тариф"}
                </Button>
                {chosen ? (
                  <p className="mt-3 text-sm leading-relaxed text-text-dim">Оплата ещё не подключена. Списание не начнётся.</p>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
      <p className="mt-6 max-w-3xl text-sm leading-relaxed text-text-dim">Оплата в рублях. Выбор тарифа пока ничего не списывает.</p>
      </div>
    </main>
  );
}
