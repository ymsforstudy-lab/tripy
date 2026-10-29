import { supabase } from "@/lib/supabase";
import { getSiteUrl } from "@/lib/site-url";

/**
 * 구글 로그인. 1.x 익명 세션이면 그 계정에 구글을 연결해 데이터를 유지한다.
 * 성공하면 /auth/callback → /auth/session-sync → / 순서로 돌아온다.
 */
export async function signInWithGoogle() {
  const redirectTo = `${getSiteUrl()}/auth/callback`;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = user?.is_anonymous
    ? await supabase.auth.linkIdentity({ provider: "google", options: { redirectTo } })
    : await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo } });
  if (error) throw error;
}

/**
 * 일단 둘러보기.
 * TODO(A 3b): 홈·지출 등록·마이페이지가 저장소로 전환되면 익명 로그인을 없애고
 * 게스트 데이터를 localStorage에만 저장한다 (docs/flow-v2.md §5).
 */
export async function startGuest() {
  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) throw error;
  if (data.user) {
    await supabase
      .from("users")
      .upsert({ id: data.user.id, display_name: null }, { onConflict: "id", ignoreDuplicates: true });
  }
}
