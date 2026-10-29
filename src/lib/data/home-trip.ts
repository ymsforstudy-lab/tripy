import type { Trip } from "./types";

// 날짜는 모두 'YYYY-MM-DD'라 문자열 비교로 순서를 판단한다.
// today는 dates.ts의 todayLocal()로 만든다.

export function isOngoingTrip(trip: Trip, today: string): boolean {
  return trip.start_date <= today && today <= trip.end_date;
}

export function isUpcomingTrip(trip: Trip, today: string): boolean {
  return trip.start_date > today;
}

/** 도착일이 지난 여행. 지난 여행 목록에만 보인다 */
export function isPastTrip(trip: Trip, today: string): boolean {
  return trip.end_date < today;
}

/**
 * 홈에 보여줄 여행 (docs/flow-v2.md §5 「여러 여행」)
 * 1. 진행 중인 여행. 여러 개면 출발일이 가장 늦은 것
 * 2. 없으면 출발일이 가장 가까운 예정 여행
 * 3. 둘 다 없으면 null → /setup
 */
export function pickHomeTrip(trips: Trip[], today: string): Trip | null {
  const ongoing = trips
    .filter((t) => isOngoingTrip(t, today))
    .sort((a, b) => b.start_date.localeCompare(a.start_date));
  if (ongoing.length > 0) return ongoing[0];

  const upcoming = trips
    .filter((t) => isUpcomingTrip(t, today))
    .sort((a, b) => a.start_date.localeCompare(b.start_date));
  return upcoming[0] ?? null;
}
