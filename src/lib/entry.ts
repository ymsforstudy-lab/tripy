// 01 앱 시작에서 어디로 보낼지 정한다 (docs/flow-v2.md §4 재진입).
// Auth·Trip 컨텍스트의 loading이 모두 끝난 뒤에만 호출한다.

export type EntryDestination = "/home" | "/setup" | "/onboarding" | "/landing";

export function resolveEntry({
  isLoggedIn,
  hasGuestData,
  hasHomeTrip,
  hasSeenLanding,
}: {
  isLoggedIn: boolean;
  hasGuestData: boolean;
  hasHomeTrip: boolean;
  hasSeenLanding: boolean;
}): EntryDestination {
  if (!isLoggedIn && !hasGuestData) return hasSeenLanding ? "/onboarding" : "/landing";
  return hasHomeTrip ? "/home" : "/setup";
}

// 랜딩은 이 기기에서 처음 한 번만 자동으로 보여준다 (docs/flow-v2.md §5 「랜딩」).
const LANDING_SEEN_KEY = "tripy:landing-seen:v1";

export function hasSeenLanding(): boolean {
  try {
    return window.localStorage.getItem(LANDING_SEEN_KEY) === "1";
  } catch {
    // 저장소를 못 쓰면 매번 랜딩으로 보내지 않도록 본 것으로 친다
    return true;
  }
}

export function markLandingSeen() {
  try {
    window.localStorage.setItem(LANDING_SEEN_KEY, "1");
  } catch {
    // 저장하지 못해도 랜딩 사용에는 지장이 없다
  }
}
