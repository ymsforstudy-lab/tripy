"use client";

import { useRouter } from "next/navigation";
import TripyCharacter from "@/components/ui/TripyCharacter";

export default function DeleteAccountCompletePage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen bg-white">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 pb-4 pt-6">
        <div className="size-6 opacity-0" />
        <div className="flex flex-1 items-center justify-center" />
        <button
          type="button"
          onClick={() => router.push("/")}
          className="flex size-6 items-center justify-center"
          aria-label="닫기"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="var(--color-gray-90)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* 본문 */}
      <div className="flex flex-col gap-[140px] px-4">
        {/* 타이틀 */}
        <div className="flex flex-col gap-4">
          <div className="py-1">
            <h1 className="text-[24px] font-semibold leading-[1.5] text-black">
              탈퇴 처리가<br />
              완료되었습니다.
            </h1>
          </div>
          <p className="text-[14px] leading-[1.5] text-gray-60">
            새로운 여행의 예산 계획이 필요해지면<br />
            언제든 다시 찾아주세요.
          </p>
        </div>

        {/* 캐릭터 이미지 */}
        <div className="flex items-center justify-center">
          <TripyCharacter type={1} />
        </div>
      </div>
    </div>
  );
}
