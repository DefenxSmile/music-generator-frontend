"use client";

import { useQuery } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useOpenAuth } from "@/hooks/use-open-auth";
import { useSessionStatus } from "@/hooks/use-session-status";
import { useSignedInHint } from "@/hooks/use-signed-in-hint";
import Button from "@/components/ui/Button";
import { apiErrorMessage } from "@/requests/api-error";
import { generationQuoteQueryOptions } from "@/requests/billing-query";
import { cn } from "@/utils/cn";
import { creditsLabel } from "@/utils/credits";
import { PRICING_PLANS } from "@/utils/pricing-plans";

/** The three preview tariffs. The page and the create paywall show this same block. */
export function PlansOffer({
  titleId,
  titleAs = "h1",
  toolbar,
}: {
  titleId?: string;
  titleAs?: "h1" | "h2";
  toolbar?: ReactNode;
}) {
  const status = useSessionStatus();
  const signedIn = useSignedInHint();
  const openAuth = useOpenAuth();
  const [chosenId, setChosenId] = useState<string | null>(null);
  const quote = useQuery(generationQuoteQueryOptions(status === "authenticated"));
  const Title = titleAs;

  function choose(id: string) {
    if (status === "anonymous") {
      openAuth({ next: "/plans" });
      return;
    }
    setChosenId(id);
  }

  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <Title id={titleId} className="lp-section-title text-text-primary">
            Тарифы
          </Title>
          <p className="lp-body mt-2 max-w-xl">
            Платите за генерации, а не за подписку на год. Начните с одной песни.
          </p>
        </div>
        {toolbar}
      </div>
      {status === "authenticated" || (status === "loading" && signedIn) ? (
        quote.isError ? (
          <p className="mt-3 text-sm text-text-primary">{apiErrorMessage(quote.error)}</p>
        ) : (
          <p className={cn("mt-3 text-sm text-text-dim", quote.data ? undefined : "invisible")}>
            На балансе {creditsLabel(quote.data?.balance ?? 0)}.
          </p>
        )
      ) : null}

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {PRICING_PLANS.map((plan) => {
          const chosen = chosenId === plan.id;
          return (
            <article
              key={plan.id}
              className={cn(
                "lp-plan-card flex flex-col rounded-xl p-5 sm:p-6",
                plan.highlighted && "lp-plan-card-popular",
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
                <span className="text-3xl font-semibold tracking-tight text-text-primary">
                  {plan.price}
                </span>
                <span className="text-sm text-text-dim">{plan.priceNote}</span>
              </p>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">{plan.description}</p>
              <ul className="mt-4 flex-1 space-y-2 border-t border-overlay/10 pt-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check
                      aria-hidden
                      className="mt-0.5 size-4 shrink-0 text-accent/70"
                      strokeWidth={1.75}
                    />
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
                  <p className="mt-3 text-sm leading-relaxed text-text-dim">
                    Оплата ещё не подключена. Списание не начнётся.
                  </p>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
      <p className="mt-6 max-w-3xl text-sm leading-relaxed text-text-dim">
        Оплата в рублях. Выбор тарифа пока ничего не списывает.
      </p>
    </>
  );
}
