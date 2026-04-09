import { createClient } from "@supabase/supabase-js";

// 클라이언트 컴포넌트용 (브라우저 — localStorage 기반 세션)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
