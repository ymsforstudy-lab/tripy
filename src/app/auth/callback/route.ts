import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${origin}/`);
  }

  const cookieStore = await cookies();

  const cookiesToSet: { name: string; value: string; options: Record<string, unknown> }[] = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(items) {
          items.forEach(({ name, value, options }) =>
            cookiesToSet.push({ name, value, options: options as Record<string, unknown> })
          );
        },
      },
    }
  );

  const { data: sessionData } = await supabase.auth.exchangeCodeForSession(code);

  if (!sessionData.session) {
    return NextResponse.redirect(`${origin}/`);
  }

  const { access_token, refresh_token } = sessionData.session;

  // 세션 토큰을 URL hash로 전달 → 브라우저 클라이언트(localStorage)가 세션 설정
  // type: "recovery"를 포함하면 Supabase 클라이언트가 PASSWORD_RECOVERY 이벤트를
  // 발생시키며 내부 setSession()과 충돌 → session-sync에서 세션 설정 실패 후 /로 튕기는 원인
  const hashParams = new URLSearchParams({
    access_token,
    refresh_token,
  });

  const response = NextResponse.redirect(
    `${origin}/auth/session-sync#${hashParams.toString()}`
  );

  // 서버 쿠키도 유지 (미들웨어 호환)
  cookiesToSet.forEach(({ name, value, options }) =>
    response.cookies.set(name, value, options)
  );

  return response;
}
