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
import { DOWNLOAD_OFFER } from "@/utils/download-offer";
import { PRICING_PLANS } from "@/utils/pricing-plans";
import { isAuthenticated, isLoggedOut, showAccountChrome } from "@/utils/session-status";

/** The three preview tariffs. The page, create paywall, and download salvage offer reuse this block. */
export function PlansOffer({
  titleId,
  titleAs = "h1",
  toolbar,
  mode = "default",
  onDecline,
}: {
  titleId?: string;
  titleAs?: "h1" | "h2";
  toolbar?: ReactNode;
  mode?: "default" | "download-offer";
  onDecline?: () => void;
}) {
  const status = useSessionStatus();
  const signedIn = useSignedInHint();
  const openAuth = useOpenAuth();
  const [chosenId, setChosenId] = useState<string | null>(null);
  const quote = useQuery(generationQuoteQueryOptions(isAuthenticated(status)));
  const Title = titleAs;
  const offer = mode === "download-offer";

  function choose(id: string) {
    if (isLoggedOut(status)) {
      openAuth({ next: "/plans" });
      return;
    }
    setChosenId(id);
  }

  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          {offer ? <p className="lp-eyebrow">Только сейчас</p> : null}
          <Title
            id={titleId}
            className={cn("lp-section-title text-text-primary", offer && "mt-2")}
          >
            {offer ? "Скачайте песню со скидкой" : "Тарифы"}
          </Title>
          <p className="lp-body mt-2 max-w-xl">
            {offer
              ? "Те же тарифы, пакет — по специальной цене один раз. Остальные без изменений."
              : "Платите за генерации, а не за подписку на год. Начните с одной песни."}
          </p>
        </div>
        {toolbar}
      </div>
      {showAccountChrome(status, signedIn) ? (
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
          const deal = offer && plan.id === DOWNLOAD_OFFER.planId;
          return (
            <article
              key={plan.id}
              className={cn(
                "lp-plan-card flex flex-col rounded-xl p-5 sm:p-6",
                (plan.highlighted || deal) && "lp-plan-card-popular",
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-base font-medium text-text-primary">{plan.name}</h2>
                {deal ? (
                  <span className="shrink-0 rounded-full bg-accent/15 px-2 py-0.5 text-[0.65rem] tracking-[0.08em] text-accent uppercase">
                    −50%
                  </span>
                ) : plan.highlighted ? (
                  <span className="shrink-0 rounded-full bg-accent/15 px-2 py-0.5 text-[0.65rem] tracking-[0.08em] text-accent uppercase">
                    Популярный
                  </span>
                ) : null}
              </div>
              <p className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="text-3xl font-semibold tracking-tight text-text-primary">
                  {deal ? DOWNLOAD_OFFER.offerPrice : plan.price}
                </span>
                {deal ? (
                  <span className="text-sm text-text-dim line-through">
                    {DOWNLOAD_OFFER.regularPrice}
                  </span>
                ) : null}
                <span className="text-sm text-text-dim">
                  {deal ? DOWNLOAD_OFFER.priceNote : plan.priceNote}
                </span>
              </p>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                {deal ? DOWNLOAD_OFFER.description : plan.description}
              </p>
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
                  variant={deal || plan.highlighted ? "primary" : "outline"}
                  size="lg"
                  className="w-full"
                  onClick={() => choose(plan.id)}
                >
                  {chosen
                    ? deal
                      ? "Предложение принято"
                      : "Тариф выбран"
                    : deal
                      ? "Забрать со скидкой"
                      : "Выбрать тариф"}
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
      {offer && onDecline ? (
        <div className="mt-6 flex justify-center">
          <Button type="button" variant="quiet" size="sm" onClick={onDecline}>
            Нет, спасибо
          </Button>
        </div>
      ) : null}
      <p className="mt-6 max-w-3xl text-sm leading-relaxed text-text-dim">
        Оплата в рублях. Выбор тарифа пока ничего не списывает.
      </p>
    </>
  );
}
