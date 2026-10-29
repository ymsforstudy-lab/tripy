"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useTrip } from "@/contexts/TripContext";
import { hasGuestData } from "@/lib/data/local-repo";
import { resolveEntry } from "@/lib/entry";

/** 01 앱 시작. 버튼 없이 로그인·여행 상태를 확인해 홈 / 여행 정보 입력 / 온보딩으로 보낸다 */
export default function AppStartPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { trip, loading: tripLoading } = useTrip();

  useEffect(() => {
    // 로딩 중에 "여행 없음"으로 판단하지 않는다
    if (authLoading || tripLoading) return;
    router.replace(
      resolveEntry({
        isLoggedIn: !!user,
        hasGuestData: hasGuestData(),
        hasHomeTrip: !!trip,
      }),
    );
  }, [authLoading, tripLoading, user, trip, router]);

  return (
    <div className="flex h-screen-safe flex-col items-center justify-center gap-gap-5 bg-gray-white">
      <Image src="/tripy-logo.svg" alt="Tripy" width={67} height={24} priority />
      <p className="text-center text-title-m font-bold leading-default text-gray-90">
        여행 비용 정리
        <br />
        트리피에서 간단하게
      </p>
    </div>
  );
}
