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

/**
 * D-day 칩 문자열. 'YYYY-MM-DD' 문자열만 받아 로컬 타임존 없이 계산한다.
 * - 출발 전: "D-N" (예: "D-8")
 * - 당일:   "D-Day"
 * - 출발 후: "D+N" (예: "D+3")
 *
 * @param today     오늘 날짜 (todayLocal() 로 얻은 'YYYY-MM-DD')
 * @param startDate 여행 출발일 ('YYYY-MM-DD')
 */
export function calcDDay(today: string, startDate: string): string {
  const diff = toUtcDay(today) - toUtcDay(startDate);
  if (diff === 0) return "D-Day";
  if (diff < 0) return `D${diff}`;   // diff already has the minus sign
  return `D+${diff}`;
}
