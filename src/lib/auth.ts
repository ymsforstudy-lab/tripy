import { supabase } from "@/lib/supabase";
import { getSiteUrl } from "@/lib/site-url";

/**
 * 구글 로그인. 1.x 익명 세션이 남아 있으면(01에서 내려받기 실패) 그 계정에 구글을 연결해 데이터를 유지한다.
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
