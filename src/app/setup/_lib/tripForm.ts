import { getCurrencyUnit, type Currency } from "@/lib/constants/currency";

export interface DateValue {
  year: number;
  month: number;
  day: number;
}

export interface TripFormValue {
  destination: string;
  departure: DateValue | null;
  arrival: DateValue | null;
  isDayTrip: boolean;
  currency: Currency | null;
  /** 원 단위 정수. 입력 전이면 null */
  amount: number | null;
}

export const EMPTY_TRIP_FORM: TripFormValue = {
  destination: "",
  departure: null,
  arrival: null,
  isDayTrip: false,
  currency: null,
  amount: null,
};

export type TripFormError = "destination" | "departure" | "arrival" | "currency" | "amount";

function toNumber(d: DateValue) {
  return d.year * 10000 + d.month * 100 + d.day;
}

export function toISODate(d: DateValue) {
  const mm = String(d.month).padStart(2, "0");
  const dd = String(d.day).padStart(2, "0");
  return `${d.year}-${mm}-${dd}`;
}

/** 당일치기면 출발일, 아니면 도착일 */
export function getEndDate(form: TripFormValue): DateValue | null {
  return form.isDayTrip ? form.departure : form.arrival;
}

/** 비었거나 규칙(도착일 ≥ 출발일, 금액은 양의 정수)에 어긋나는 필드를 돌려준다 */
export function validateTripForm(form: TripFormValue): TripFormError[] {
  const errors: TripFormError[] = [];
  if (!form.destination.trim()) errors.push("destination");
  if (!form.departure) errors.push("departure");

  const end = getEndDate(form);
  if (!end) errors.push("arrival");
  else if (form.departure && toNumber(end) < toNumber(form.departure)) errors.push("arrival");

  if (!form.currency) errors.push("currency");
  if (form.amount === null || !Number.isInteger(form.amount) || form.amount <= 0) errors.push("amount");
  return errors;
}

export function isTripFormComplete(form: TripFormValue) {
  return validateTripForm(form).length === 0;
}

function calcNights(start: DateValue, end: DateValue) {
  const s = new Date(start.year, start.month - 1, start.day);
  const e = new Date(end.year, end.month - 1, end.day);
  return Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
}

/** "4박5일" / "당일치기". 기간이 정해지지 않았으면 null */
export function formatNights(form: TripFormValue): string | null {
  const end = getEndDate(form);
  if (!form.departure || !end) return null;
  const nights = calcNights(form.departure, end);
  if (nights < 0) return null;
  return nights === 0 ? "당일치기" : `${nights}박${nights + 1}일`;
}

/** "2026.03.01" */
export function formatDotDate(d: DateValue) {
  return toISODate(d).replaceAll("-", ".");
}

/** "2026.03.01 - 2026.03.04", 당일치기는 하루만 */
export function formatPeriod(form: TripFormValue): string | null {
  const end = getEndDate(form);
  if (!form.departure || !end) return null;
  const start = formatDotDate(form.departure);
  return form.isDayTrip || toNumber(end) === toNumber(form.departure)
    ? start
    : `${start} - ${formatDotDate(end)}`;
}

function trimDecimal(n: number) {
  return String(Math.round(n * 10) / 10);
}

/** 3,000,000 → "3백만", 25,000,000 → "2.5천만", 50,000 → "5만" */
export function formatAmountShort(amount: number) {
  if (amount >= 1e8) return `${trimDecimal(amount / 1e8)}억`;
  if (amount >= 1e7) return `${trimDecimal(amount / 1e7)}천만`;
  if (amount >= 1e6) return `${trimDecimal(amount / 1e6)}백만`;
  if (amount >= 1e4) return `${trimDecimal(amount / 1e4)}만`;
  return amount.toLocaleString("ko-KR");
}

/** 예산 라벨 옆 요약. 금액·통화가 다 있어야 보인다 */
export function formatBudgetSummary(form: TripFormValue): { amount: string; unit: string } | null {
  if (!form.currency || form.amount === null || form.amount <= 0) return null;
  return { amount: formatAmountShort(form.amount), unit: getCurrencyUnit(form.currency) };
}
