"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import TripyCharacter from "@/components/ui/TripyCharacter";
import { signInWithGoogle, startGuest } from "@/lib/auth";

// 기존 스플래시 로그인 버튼과 같은 외곽선 스타일. 공용 Button에는 이 variant가 없다
const OUTLINE_BUTTON =
  "flex h-14 w-full items-center justify-center gap-2 rounded-12 border border-gray-30 bg-gray-white text-body-l font-bold leading-default text-gray-50 disabled:opacity-50";

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

  const handleGuestBrowse = async () => {
    setPending(true);
    setErrorMessage(null);
    try {
      await startGuest();
      router.replace("/setup");
    } catch (e) {
      console.error("둘러보기 시작 실패:", e);
      setErrorMessage("둘러보기를 시작하지 못했어요. 다시 시도해주세요.");
      setPending(false);
    }
  };

  return (
    <div className="flex h-screen-safe flex-col bg-gray-white">
      <div className="flex flex-1 flex-col items-center justify-center gap-8">
        <Image src="/tripy-logo.svg" alt="Tripy" width={67} height={24} priority />
        <TripyCharacter variant={1} />
        <h1 className="text-center text-title-xl font-bold leading-default text-gray-90">
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
