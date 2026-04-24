import { createBrowserClient } from "@supabase/ssr";

// 브라우저 클라이언트 — 쿠키 기반 세션 저장 (proxy.ts의 server client와 동일 매체).
// PKCE OAuth의 code_verifier도 쿠키에 저장되어 서버 콜백 라우트에서 접근 가능.
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
