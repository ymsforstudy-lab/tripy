export const CURRENCIES = ["KRW", "USD", "JPY", "EUR"] as const;
export type Currency = (typeof CURRENCIES)[number];

export const CURRENCY_UNIT: Record<Currency, string> = {
  KRW: "원",
  USD: "달러",
  JPY: "엔",
  EUR: "유로",
};

export function getCurrencyUnit(code: string | null | undefined): string {
  if (!code) return CURRENCY_UNIT.KRW;
  return CURRENCY_UNIT[code as Currency] ?? CURRENCY_UNIT.KRW;
}
