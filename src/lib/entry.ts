// 01 앱 시작에서 어디로 보낼지 정한다 (docs/flow-v2.md §4 재진입).
// Auth·Trip 컨텍스트의 loading이 모두 끝난 뒤에만 호출한다.

export type EntryDestination = "/home" | "/setup" | "/onboarding";

export function resolveEntry({
  isLoggedIn,
  hasGuestData,
  hasHomeTrip,
}: {
  isLoggedIn: boolean;
  hasGuestData: boolean;
  hasHomeTrip: boolean;
}): EntryDestination {
  if (!isLoggedIn && !hasGuestData) return "/onboarding";
  return hasHomeTrip ? "/home" : "/setup";
}
