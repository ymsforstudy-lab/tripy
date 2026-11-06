"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useTrip } from "@/contexts/TripContext";
import { supabase } from "@/lib/supabase";
import { hasGuestData } from "@/lib/data/local-repo";
import { downloadAnonymousData } from "@/lib/data/guest-migration";
import { hasSeenLanding, resolveEntry } from "@/lib/entry";

/** 01 앱 시작. 버튼 없이 로그인·여행 상태를 확인해 홈 / 여행 정보 입력 / 온보딩(첫 방문은 랜딩)으로 보낸다 */
export default function AppStartPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { trip, loading: tripLoading } = useTrip();
  const anonAttempted = useRef(false);
  const [anonFailed, setAnonFailed] = useState(false);

  // 1.x 익명 세션: 여행·지출을 기기로 내려받고 로그아웃한다 (docs/flow-v2.md §5).
  // 실패하면 세션을 유지하고 다음 실행 때 다시 시도한다. 서버 데이터는 지우지 않는다.
  useEffect(() => {
    if (authLoading || !user?.is_anonymous || anonAttempted.current) return;
    anonAttempted.current = true;
    const userId = user.id;
    (async () => {
      try {
        await downloadAnonymousData(userId);
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      } catch (e) {
        console.error("익명 계정 데이터 내려받기 실패:", e);
        setAnonFailed(true);
      }
    })();
  }, [authLoading, user]);

  useEffect(() => {
    // 로딩 중에 "여행 없음"으로 판단하지 않는다
    if (authLoading || tripLoading) return;
    // 익명 세션 정리 중. 성공하면 user가 null로 바뀐 뒤 다시 분기한다
    if (user?.is_anonymous && !anonFailed) return;
    router.replace(
      resolveEntry({
        isLoggedIn: !!user,
        hasGuestData: hasGuestData(),
        hasHomeTrip: !!trip,
        hasSeenLanding: hasSeenLanding(),
      }),
    );
  }, [authLoading, tripLoading, user, trip, anonFailed, router]);

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
