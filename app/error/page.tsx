"use client";

import { useRouter } from "next/navigation";
import BottomCTA from "@/components/ui/BottomCTA";
import TripyCharacter from "@/components/ui/TripyCharacter";

export default function ErrorPage() {
  const router = useRouter();

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-white">
      {/* 중앙 콘텐츠 */}
      <div className="flex flex-1 flex-col items-center justify-center gap-5 px-4 pb-24">
        <div className="flex flex-col items-center gap-[10px] text-center">
          <p className="text-[24px] font-semibold leading-[1.5] text-black">
            일시적인 오류가 발생했어요.
          </p>
          <div className="text-[16px] font-semibold leading-[1.5] text-gray-60">
            <p>서비스 이용에 불편을 드려 죄송합니다.</p>
            <p>잠시 후 다시 이용해 주세요</p>
          </div>
        </div>
        <TripyCharacter type={4} />
      </div>

      {/* 하단 버튼 */}
      <div className="fixed bottom-0 left-1/2 w-full max-w-[375px] -translate-x-1/2">
        <BottomCTA label="홈으로 이동" onClick={() => router.push("/home")} />
      </div>
    </div>
  );
}
