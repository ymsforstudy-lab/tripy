import { redirect } from "next/navigation";

// 1.x는 여행을 만든 뒤 여기서 예산을 넣었다. 2.0은 /setup에서 함께 저장하므로 옛 링크는 홈으로 보낸다.
// /setup으로 보내면 이미 만든 여행이 한 번 더 생길 수 있다 (docs/flow-v2.md §6)
export default function LegacyBudgetPage() {
  redirect("/home");
}
