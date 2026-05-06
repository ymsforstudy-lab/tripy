"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/layout/BottomNav";
import ProfileAvatar from "@/components/ui/ProfileAvatar";
import CategoryIcon from "@/components/ui/CategoryIcon";
import { CategoryId, CATEGORY_MAP } from "@/lib/constants/categories";
import { supabase } from "@/lib/supabase";
import StatusBadge from "@/components/ui/StatusBadge";

type CategoryRank = {
  rank: number;
  categoryId: CategoryId;
  label: string;
};

export default function MyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [nickname, setNickname] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [tripCount, setTripCount] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalDays, setTotalDays] = useState(0);
  const [categoryRanking, setCategoryRanking] = useState<CategoryRank[]>([]);
  const [lastUpdated, setLastUpdated] = useState("");

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  useEffect(() => {
    async function fetchData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      // 프로필 닉네임 + 아바타
      const { data: profile } = await supabase
        .from("users")
        .select("display_name, avatar_url")
        .eq("id", user.id)
        .single();

      if (profile?.display_name) {
        setNickname(profile.display_name);
      }
      if (profile?.avatar_url) {
        setAvatarUrl(profile.avatar_url);
      }

      // 전체 여행 조회
      const { data: trips } = await supabase
        .from("trips")
        .select("id, start_date, end_date")
        .eq("user_id", user.id);

      if (!trips || trips.length === 0) {
        setLoading(false);
        return;
      }

      setTripCount(trips.length);

      // 여행 ��수 계산
      const days = trips.reduce((sum, trip) => {
        const start = new Date(trip.start_date);
        const end = new Date(trip.end_date);
        const diff = Math.floor(
          (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
        ) + 1;
        return sum + Math.max(diff, 0);
      }, 0);
      setTotalDays(days);

      // 전체 지출 조회
      const tripIds = trips.map((t) => t.id);
      const { data: expenses } = await supabase
        .from("expenses")
        .select("amount, category, created_at")
        .in("trip_id", tripIds);

      if (expenses && expenses.length > 0) {
        // 총 지출
        const total = expenses.reduce((sum, e) => sum + e.amount, 0);
        setTotalExpense(total);

        // 카테고리별 합산 → 순위
        const categorySum: Record<string, number> = {};
        expenses.forEach((e) => {
          categorySum[e.category] = (categorySum[e.category] ?? 0) + e.amount;
        });

        const sorted = Object.entries(categorySum)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([catId], idx) => ({
            rank: idx + 1,
            categoryId: catId as CategoryId,
            label: CATEGORY_MAP[catId as CategoryId]?.label ?? catId,
          }));
        setCategoryRanking(sorted);

        // 최근 업데이트 날짜
        const latest = expenses.reduce((max, e) =>
          e.created_at > max ? e.created_at : max,
          expenses[0].created_at
        );
        const latestDate = new Date(latest);
        setLastUpdated(
          `${latestDate.getMonth() + 1}/${latestDate.getDate()}`
        );
      }

      setLoading(false);
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <span className="text-sm text-gray-50">로딩 중...</span>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-center pb-4 pt-6">
        <span className="text-base font-semibold leading-[1.5] text-gray-90">
          마이페이지
        </span>
      </div>

      {/* 프로필 카드 + 여행 통계 */}
      <div className="flex flex-col gap-4 px-4">
        {/* 프��필 카드 */}
        <div className="rounded-2xl border border-gray-20 bg-white p-4 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-2 opacity-80">
            <Link href="/mypage/profile"><ProfileAvatar avatarUrl={avatarUrl} /></Link>
            <div className="flex flex-col gap-1">
              <Link
                href="/mypage/profile"
                className="flex items-center gap-0.5"
              >
                <span className="text-base font-semibold text-black">
                  {nickname || "여행자"}
                </span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M6 10L8 8L6 6"
                    stroke="#1D1D1D"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-60">꼼꼼한 가계부 지킴이!</span>
                <StatusBadge variant="good" />
              </div>
            </div>
          </div>
        </div>

        {/* 여행 통계 카드 */}
        <Link
          href="/travels"
          className="block rounded-2xl border border-gray-20 bg-white p-4 cursor-pointer active:opacity-70"
        >
          <div className="flex flex-col gap-4">
            <div className="flex gap-1 text-base font-semibold">
              <span className="text-black">여행</span>
              <span className="font-bold text-green-50">
                {tripCount > 0 ? `${tripCount}회째!` : "시작해보세요!"}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex h-6 items-center gap-1">
                <span className="text-sm text-gray-90">여행 지출 총액</span>
                <div className="flex flex-1 items-center justify-end gap-0.5">
                  <span className="flex-1 text-right text-base font-semibold text-gray-90">
                    {totalExpense.toLocaleString("ko-KR")}
                  </span>
                  <span className="text-sm text-gray-90">원</span>
                </div>
              </div>
              <div className="flex h-6 items-center gap-1">
                <span className="text-sm text-gray-90">여행 일수</span>
                <div className="flex flex-1 items-center justify-end gap-0.5">
                  <span className="flex-1 text-right text-base font-semibold text-gray-90">
                    {totalDays}
                  </span>
                  <span className="text-sm text-gray-90">일</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* 구분선 */}
      <div className="mt-4 h-2 bg-green-10">
        <div className="h-full border-t border-gray-30 bg-gray-10" />
      </div>

      {/* ��테고리 내역 순위 */}
      <div className="flex flex-col gap-5 px-4 py-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-black">카테고리 내역 순위</span>
          <span className="text-xs text-gray-60">
            {lastUpdated ? `${lastUpdated} 업데이트` : "데��터 없음"}
          </span>
        </div>

        {/* 수평 스크롤 */}
        <div
          className="-mx-4 flex gap-2 px-4 pb-1"
          style={{
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          } as React.CSSProperties}
        >
          {categoryRanking.length > 0 ? (
            categoryRanking.map((item) => (
              <div
                key={item.rank}
                className="flex w-24 shrink-0 flex-col items-center justify-center gap-1 rounded-xl bg-gray-5 p-4"
              >
                <div className="flex size-5 items-center justify-center rounded-lg bg-gray-20">
                  <span className="text-[10px] text-gray-60">{item.rank}</span>
                </div>
                <CategoryIcon category={item.categoryId} size={24} className="m-[10px]" />
                <span className="text-xs text-black">{item.label}</span>
              </div>
            ))
          ) : (
            <div className="flex w-full items-center justify-center py-4">
              <span className="text-sm text-gray-50">아직 지출 내역이 없어요</span>
            </div>
          )}
        </div>
      </div>

      {/* 로그아웃 */}
      <div className="mt-auto mb-[116px] flex flex-col items-center gap-3">
        <div className="h-2 w-full border-t border-gray-30 bg-gray-10" />
        <button
          onClick={handleLogout}
          className="w-full text-center text-sm leading-[1.5] text-gray-70"
        >
          로그아웃
        </button>
      </div>

      {/* 하단 네비게이션 */}
      <BottomNav />
    </div>
  );
}
