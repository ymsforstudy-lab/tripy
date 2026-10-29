import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

// 가입 시 닉네임 자동 생성 (docs/flow-v2.md §5 「닉네임」).
// 규칙은 /mypage/profile과 같다: 한글·영문·숫자 3~10자.

const NICKNAME_PATTERN = /^[가-힣a-zA-Z0-9]{3,10}$/;
const MAX_ATTEMPTS = 5;
/** Postgres unique_violation. display_name에 unique 제약이 있을 때 중복이면 이 코드가 온다 */
const UNIQUE_VIOLATION = "23505";

export function isValidNickname(value: string): boolean {
  return NICKNAME_PATTERN.test(value);
}

/** 구글 이름에서 허용 문자만 남긴다. 규칙에 맞지 않으면 null */
export function nicknameFromName(name: unknown): string | null {
  if (typeof name !== "string") return null;
  const cleaned = name.replace(/[^가-힣a-zA-Z0-9]/g, "").slice(0, 10);
  return isValidNickname(cleaned) ? cleaned : null;
}

/** 여행자1234 형식 */
export function randomNickname(): string {
  const [n] = crypto.getRandomValues(new Uint16Array(1));
  return `여행자${String(n % 10000).padStart(4, "0")}`;
}

/**
 * 닉네임이 없으면 만들어 저장한다. 이미 있으면 그대로 둔다.
 * 구글 이름을 먼저 쓰고, 맞지 않거나 중복이면 랜덤 닉네임으로 다시 시도한다.
 * 실패해도 로그인을 막지 않는다. 닉네임은 마이페이지에서 고칠 수 있다.
 */
export async function ensureNickname(user: User): Promise<void> {
  const { data: profile, error: readError } = await supabase
    .from("users")
    .select("display_name")
    .eq("id", user.id)
    .maybeSingle();
  if (readError) throw readError;
  if (profile?.display_name) return;

  const fromName = nicknameFromName(user.user_metadata?.full_name ?? user.user_metadata?.name);
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const displayName = attempt === 0 && fromName ? fromName : randomNickname();
    const { error } = await supabase
      .from("users")
      .upsert({ id: user.id, display_name: displayName }, { onConflict: "id" });
    if (!error) return;
    if (error.code !== UNIQUE_VIOLATION) throw error;
  }
  throw new Error("닉네임을 만들지 못했습니다.");
}
