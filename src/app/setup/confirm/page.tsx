import { redirect } from "next/navigation";

// 1.x 여행 설정 단계. 2.0은 /setup 한 화면이라 옛 링크·북마크만 넘겨준다 (docs/flow-v2.md §6)
export default function LegacySetupConfirmPage() {
  redirect("/setup");
}
