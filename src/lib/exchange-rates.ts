import type { Currency } from "./constants/currency";

export type ExchangeRates = Record<string, number>;

/** API 장애 시 비상 환율 (USD 기준) */
export const FALLBACK_RATES: ExchangeRates = {
  USD: 1,
  KRW: 1380,
  JPY: 155,
  EUR: 0.92,
};

const ZERO_DECIMAL_CURRENCIES: Currency[] = ["KRW", "JPY"];

function roundForCurrency(amount: number, currency: string): number {
  if (ZERO_DECIMAL_CURRENCIES.includes(currency as Currency)) {
    return Math.round(amount);
  }
  return Math.round(amount * 100) / 100;
}

/**
 * 통화 변환 (rates는 USD 기준)
 * amount를 fromCurrency에서 toCurrency로 변환
 */
export function convertAmount(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: ExchangeRates
): number {
  if (fromCurrency === toCurrency) return amount;

  const fromRate = rates[fromCurrency];
  const toRate = rates[toCurrency];

  if (!fromRate || !toRate) return amount;

  const converted = (amount / fromRate) * toRate;
  return roundForCurrency(converted, toCurrency);
}

/**
 * 모든 지출을 기준 통화로 변환하여 합산
 */
export function convertExpensesToBaseCurrency(
  expenses: { amount: number; currency: string }[],
  baseCurrency: string,
  rates: ExchangeRates
): number {
  const total = expenses.reduce(
    (sum, e) => sum + convertAmount(e.amount, e.currency, baseCurrency, rates),
    0
  );
  return roundForCurrency(total, baseCurrency);
}
