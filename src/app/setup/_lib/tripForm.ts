import { CURRENCIES, getCurrencyUnit, type Currency } from "@/lib/constants/currency";
import { nightsBetween } from "@/lib/data/dates";
import type { Trip, TripInput } from "@/lib/data/types";

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

function fromISODate(s: string): DateValue {
  const [year, month, day] = s.split("-").map(Number);
  return { year, month, day };
}

/** 수정 모드: 저장된 여행으로 폼을 채운다. 여행지는 title("일본 여행")에서 꺼낸다 (toTripInput의 반대) */
export function fromTrip(trip: Trip): TripFormValue {
  const isDayTrip = trip.start_date === trip.end_date;
  return {
    destination: trip.title.replace(/\s*여행$/, "").trim(),
    departure: fromISODate(trip.start_date),
    arrival: isDayTrip ? null : fromISODate(trip.end_date),
    isDayTrip,
    currency: (CURRENCIES as readonly string[]).includes(trip.currency) ? (trip.currency as Currency) : null,
    // 1.x는 예산을 건너뛰면 0이 남는다. 0은 미입력으로 보고 다시 받는다
    amount: trip.total_budget > 0 ? trip.total_budget : null,
  };
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

/** "4박5일" / "당일치기". 기간이 정해지지 않았거나 도착일이 출발일보다 앞이면 null */
export function formatNights(form: TripFormValue): string | null {
  const end = getEndDate(form);
  if (!form.departure || !end || toNumber(end) < toNumber(form.departure)) return null;
  const nights = nightsBetween(toISODate(form.departure), toISODate(end));
  return nights === 0 ? "당일치기" : `${nights}박${nights + 1}일`;
}

/** 검증을 통과한 폼을 createTrip 입력으로 바꾼다. 통과하지 못했으면 null */
export function toTripInput(form: TripFormValue): TripInput | null {
  const end = getEndDate(form);
  if (!isTripFormComplete(form) || !form.departure || !end || !form.currency || form.amount === null) {
    return null;
  }
  return {
    // 1.x와 같게 국가는 title에만 넣는다. destination은 1.x의 국내 지역 자리라 2.0(지역 선택 없음)에서는 비운다
    title: `${form.destination.trim()} 여행`,
    destination: null,
    start_date: toISODate(form.departure),
    end_date: toISODate(end),
    total_budget: form.amount,
    currency: form.currency,
  };
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
