"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

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

      // display_name 확인 후 리다이렉트
      const { data: profile } = await supabase
        .from("users")
        .select("display_name")
        .eq("id", data.session.user.id)
        .single();

      router.replace(profile?.display_name ? "/home" : "/nickname");
    }

    syncSession();
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-white">
      <span className="text-sm text-gray-50">로그인 중...</span>
    </div>
  );
}
