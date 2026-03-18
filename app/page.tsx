"use client";

import Image from "next/image";
import { supabase } from "@/src/lib/supabase";

export default function SplashPage() {
  const handleStart = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) console.error(error);
  };

  return (
    <div className="relative flex h-screen flex-col bg-white">
      {/* 중앙 콘텐츠 */}
      <div className="flex flex-1 flex-col items-center justify-center gap-5">
        <h1 className="text-center text-2xl font-bold leading-[1.5] text-black">
          여행지를
          <br />
          등록해볼까요?
        </h1>
        <div className="relative h-[198px] w-[120px]">
          <Image
            src="/mascot.png"
            alt="트리피 마스코트"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="px-4 pb-4 pt-7">
        <button
          onClick={handleStart}
          className="flex h-14 w-full items-center justify-center rounded-xl bg-green-50 text-base text-white"
        >
          시작하기
        </button>
      </div>
    </div>
  );
}
