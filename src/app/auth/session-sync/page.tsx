"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ensureNickname } from "@/lib/nickname";

export default function SessionSyncPage() {
  const router = useRouter();

  useEffect(() => {
    async function syncSession() {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");

      if (!access_token || !refresh_token) {
        router.replace("/");
        return;
      }

      const { data, error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });

      if (error || !data.session?.user) {
        console.error("[session-sync] 세션 설정 실패:", error);
        router.replace("/");
        return;
      }

      // 닉네임이 없으면 자동으로 만든다. 실패해도 로그인은 이어 간다(마이페이지에서 수정 가능)
      try {
        await ensureNickname(data.session.user);
      } catch (e) {
        console.error("[session-sync] 닉네임 생성 실패:", e);
      }

      // 홈·여행 입력 분기는 01(/)이 맡는다
      router.replace("/");
    }

    syncSession();
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-white">
      <span className="text-sm text-gray-50">로그인 중...</span>
    </div>
  );
}
