"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SplashPage() {
  const router = useRouter();

  // OAuth 리다이렉트 후 세션 감지 → 자동 이동
  // INITIAL_SESSION: 이미 로그인된 상태로 /에 진입 시 자동 리다이렉트
  // SIGNED_IN: OAuth 로그인 완료 시 리다이렉트
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if ((event === "SIGNED_IN" || event === "INITIAL_SESSION") && session?.user) {
          const { data: profile } = await supabase
            .from("users")
            .select("display_name")
            .eq("id", session.user.id)
            .single();

          router.replace(profile?.display_name ? "/home" : "/nickname");
        }
      }
    );
    return () => subscription.unsubscribe();
  }, [router]);

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) console.error(error);
  };

  return (
    <div className="flex h-screen flex-col bg-white">
      {/* 중앙 콘텐츠 */}
      <div className="flex flex-1 flex-col items-center justify-center gap-[34px]">
        {/* Tripy 로고 */}
        <div className="relative h-6 w-[67px]">
          <Image
            src="/tripy-logo.svg"
            alt="Tripy"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* 타이틀 */}
        <h1 className="text-center text-2xl font-bold leading-[1.5] tracking-[-0.48px] text-gray-90">
          여행 비용 정리는<br />이제 트리피에서!
        </h1>
      </div>

      {/* 하단 버튼 영역 */}
      <div className="flex flex-col gap-2 px-4 pb-8 pt-6">
        {/* 구글 로그인 */}
        <button
          onClick={handleGoogleLogin}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-xl border border-gray-30 bg-white text-base font-bold text-gray-50"
        >
          <GoogleIcon />
          구글 로그인
        </button>

        {/* 일단 둘러보기 */}
        <button
          onClick={() => router.push("/setup")}
          className="flex h-14 w-full items-center justify-center rounded-xl border border-gray-30 bg-white text-base font-bold text-gray-50"
        >
          일단 둘러보기
        </button>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"
        fill="#4285F4"
      />
      <path
        d="M1.508 4.791A7.962 7.962 0 0 0 0 8c0 1.168.243 2.278.668 3.286L4.47 8.09a4.79 4.79 0 0 1 0-3.062L1.508 4.791z"
        fill="#34A853"
      />
      <path
        d="M8 16c2.158 0 3.978-.707 5.303-1.931l-3.645-2.823a4.347 4.347 0 0 1-1.658.475 4.494 4.494 0 0 1-4.248-3.07L.668 11.286A8 8 0 0 0 8 16z"
        fill="#FBBC05"
      />
      <path
        d="M15.545 6.558H8v3.08h4.277a3.702 3.702 0 0 1-1.6 2.431l3.646 2.823C15.13 13.492 16 11.434 16 9c0-.484-.047-.956-.139-1.626L15.545 6.558z"
        fill="#EA4335"
      />
    </svg>
  );
}
