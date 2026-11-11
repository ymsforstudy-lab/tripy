"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { signInWithGoogle } from "@/lib/auth";

// Figma 03 온보딩(1391:3637)의 외곽선 버튼: border/strong 테두리 + text/action-secondary 글자, 50% 불투명. 공용 Button에는 이 variant가 없다
const OUTLINE_BUTTON =
  "flex h-14 w-full items-center justify-center gap-2 rounded-12 border border-border-strong bg-gray-white text-body-l font-semibold leading-default text-text-action-secondary opacity-50";

/** 03 온보딩. 로그인하지 않았고 기기에 게스트 데이터도 없는 사용자만 본다 */
export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [pending, setPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 이미 로그인한 사용자는 01에서 다시 분기한다
  useEffect(() => {
    if (!loading && user) router.replace("/");
  }, [loading, user, router]);

  const handleGoogleLogin = async () => {
    setPending(true);
    setErrorMessage(null);
    try {
      await signInWithGoogle();
    } catch (e) {
      console.error("구글 로그인 실패:", e);
      setErrorMessage("구글 로그인에 실패했어요. 다시 시도해주세요.");
      setPending(false);
    }
  };

  // 게스트는 세션 없이 이 기기(localStorage)에만 저장한다 (docs/flow-v2.md §5)
  const handleGuestBrowse = () => {
    router.replace("/setup");
  };

  return (
    <div className="flex h-screen-safe flex-col bg-gray-white">
      {/* pt-16: Figma 헤더(64px) 자리. 아이콘은 투명이라 그리지 않는다 */}
      <div className="flex flex-1 flex-col items-center justify-center gap-8.5 pt-16">
        <Image src="/tripy-logo.svg" alt="Tripy" width={67} height={24} priority />
        {/* Figma TripyCharacter Welcome. 공용 tripy-6(180×220)은 흐려서 Figma 원본(572×1024)을 쓴다.
            원본 파일이 가로로 눌린 채 저장돼 있어, Figma처럼 138×198 칸에 맞춰 늘려 그려야 원래 모습이 된다 */}
        <div className="flex h-55 w-45 items-center justify-center p-2">
          <Image
            src="/images/onboarding/tripy-welcome.png"
            alt="손을 흔드는 트리피"
            width={572}
            height={1024}
            priority
            className="h-49.5 w-34.5 object-fill"
          />
        </div>
        <h1 className="text-center text-title-xl font-semibold leading-default text-text-primary">
          여행 비용 정리는
          <br />
          이제 트리피에서!
        </h1>
      </div>

      <div className="flex flex-col gap-gap-3 px-4 pb-8 pt-6">
        {errorMessage && <p className="text-center text-body-s text-danger-50">{errorMessage}</p>}
        <button type="button" onClick={handleGoogleLogin} disabled={pending} className={OUTLINE_BUTTON}>
          <Image src="/icons/google.svg" alt="" width={16} height={16} />
          구글 로그인
        </button>
        <button type="button" onClick={handleGuestBrowse} disabled={pending} className={OUTLINE_BUTTON}>
          일단 둘러보기
        </button>
        <p className="text-center text-body-s text-gray-50">
          로그인하지 않으면 이 기기에만 저장되고, 다른 기기나 브라우저에서는 볼 수 없어요.
        </p>
      </div>
    </div>
  );
}
