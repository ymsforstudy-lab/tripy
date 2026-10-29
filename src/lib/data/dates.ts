// 여행·지출 날짜는 'YYYY-MM-DD' 문자열로만 다룬다.
// toISOString()은 UTC 기준이라 한국 시간 0~9시에 하루 전 날짜가 나오므로 쓰지 않는다.

/** 로컬 시간대 기준 'YYYY-MM-DD' */
export function toDateString(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/** 오늘 날짜 (로컬 시간대) */
export function todayLocal(): string {
  return toDateString(new Date());
}

function toUtcDay(dateString: string): number {
  const [y, m, d] = dateString.split("-").map(Number);
  return Date.UTC(y, m - 1, d) / 86_400_000;
}

/** 박 수 = 날짜 차이. 당일치기는 0 */
export function nightsBetween(start: string, end: string): number {
  return Math.max(0, toUtcDay(end) - toUtcDay(start));
}

/** 일 수 = 박 수 + 1 */
export function daysBetween(start: string, end: string): number {
  return nightsBetween(start, end) + 1;
}
