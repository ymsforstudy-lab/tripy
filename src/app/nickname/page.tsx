import { redirect } from "next/navigation";

// 2.0은 닉네임을 자동으로 만들고 수정은 /mypage/profile에서 한다 (docs/flow-v2.md §5 「닉네임」).
// auth/session-sync가 아직 닉네임 없는 사용자를 여기로 보내므로, 진입 분기(/)로 넘겨 여행 등록 흐름을 이어 간다.
export default function LegacyNicknamePage() {
  redirect("/");
}
