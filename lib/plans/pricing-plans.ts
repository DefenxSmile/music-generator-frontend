/**
 * Same three preview tariffs as the landing (`songs-generator-landing/lib/pricing-plans.ts`).
 * Amounts are not an offer: Java has no payment, and choosing a plan charges nothing.
 */

export type PricingPlan = {
  id: string;
  name: string;
  price: string;
  priceNote: string;
  description: string;
  features: string[];
  highlighted: boolean;
};

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "single",
    name: "Одна песня",
    price: "349 ₽",
    priceNote: "за одну генерацию",
    description: "Для одной идеи или одного текста.",
    features: ["Песня из идеи или своего текста", "Музыка и русский вокал", "Прослушивание результата"],
    highlighted: false,
  },
  {
    id: "pack",
    name: "Несколько песен",
    price: "1 290 ₽",
    priceNote: "пакет из 5 генераций",
    description: "Несколько песен по разным поводам.",
    features: ["Пять генераций", "Музыка и русский вокал", "Скачивание готового трека"],
    highlighted: true,
  },
  {
    id: "month",
    name: "Регулярное использование",
    price: "2 490 ₽",
    priceNote: "в месяц, 30 генераций",
    description: "Песни к событиям, подаркам и видео.",
    features: ["30 генераций в месяц", "Музыка и русский вокал", "Скачивание готового трека"],
    highlighted: false,
  },
];
