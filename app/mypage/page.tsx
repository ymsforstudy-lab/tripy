"use client";

import React from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/layout/BottomNav";
import ProfileAvatar from "@/components/ui/ProfileAvatar";
import CategoryIcon from "@/components/ui/CategoryIcon";
import { CategoryId } from "@/lib/constants/categories";

const CATEGORY_RANKING: { rank: number; categoryId: CategoryId; label: string }[] = [
  { rank: 1, categoryId: "accommodation", label: "숙소" },
  { rank: 2, categoryId: "food", label: "식비" },
  { rank: 3, categoryId: "transport", label: "교통" },
  { rank: 4, categoryId: "activity", label: "액티비티" },
  { rank: 5, categoryId: "shopping", label: "쇼핑" },
];

// 목업 데이터 — 추후 Supabase 연동
const USER = {
  nickname: "드리미",
  tagline: "꼼꼼한 가계부 지킴이!",
  grade: "Good",
};

const STATS = {
  tripCount: 3,
  totalExpense: 2240000,
  totalDays: 245,
};

export default function MyPage() {
  const router = useRouter();
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
        {/* 프로필 카드 */}
        <div className="rounded-2xl border border-gray-20 bg-white p-4 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-2 opacity-80">
            <ProfileAvatar onClick={() => router.push("/mypage/profile")} />
            <div className="flex flex-col gap-1">
              {/* 닉네임 + 오른쪽 chevron */}
              <button
                className="flex items-center gap-0.5"
                onClick={() => router.push("/mypage/profile")}
              >
                <span className="text-base font-semibold text-black">
                  {USER.nickname}
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
              </button>
              {/* 한마디 + 등급 */}
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-60">{USER.tagline}</span>
                <div className="rounded-lg bg-green-0 px-1 py-0.5">
                  <span className="text-xs text-green-50">{USER.grade}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 여행 통계 카드 */}
        <div
          className="rounded-2xl border border-gray-20 bg-white p-4 cursor-pointer active:opacity-70"
          onClick={() => router.push("/travels")}
        >
          <div className="flex flex-col gap-4">
            <div className="flex gap-1 text-base font-semibold">
              <span className="text-black">여행</span>
              <span className="font-bold text-green-50">{STATS.tripCount}회째!</span>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex h-6 items-center gap-1">
                <span className="text-sm text-gray-90">여행 지출 총액</span>
                <div className="flex flex-1 items-center justify-end gap-0.5">
                  <span className="flex-1 text-right text-base font-semibold text-gray-90">
                    {STATS.totalExpense.toLocaleString("ko-KR")}
                  </span>
                  <span className="text-sm text-gray-90">원</span>
                </div>
              </div>
              <div className="flex h-6 items-center gap-1">
                <span className="text-sm text-gray-90">여행 일수</span>
                <div className="flex flex-1 items-center justify-end gap-0.5">
                  <span className="flex-1 text-right text-base font-semibold text-gray-90">
                    {STATS.totalDays}
                  </span>
                  <span className="text-sm text-gray-90">일</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 구분선 */}
      <div className="mt-4 h-2 bg-green-10">
        <div className="h-full border-t border-gray-30 bg-gray-10" />
      </div>

      {/* 카테고리 내역 순위 */}
      <div className="flex flex-col gap-5 px-4 py-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-black">카테고리 내역 순위</span>
          <span className="text-xs text-gray-60">3/24 업데이트</span>
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
          {CATEGORY_RANKING.map((item) => (
            <div
              key={item.rank}
              className="flex w-24 shrink-0 flex-col items-center justify-center gap-1 rounded-xl bg-gray-5 p-4"
            >
              {/* 순위 배지 */}
              <div className="flex size-5 items-center justify-center rounded-lg bg-gray-20">
                <span className="text-[10px] text-gray-60">{item.rank}</span>
              </div>
              {/* 카테고리 아이콘 */}
              <CategoryIcon category={item.categoryId} size={24} className="m-[10px]" />
              {/* 카테고리명 */}
              <span className="text-xs text-black">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 하단 네비게이션 */}
      <div className="mt-auto px-[47px]">
        <BottomNav />
      </div>
    </div>
  );
}
