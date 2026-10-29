"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BottomNav from "@/components/ui/BottomNav";
import FAB from "@/components/ui/FAB";
import BudgetProgressBar from "@/components/ui/BudgetProgressBar";
import LoadingScreen from "@/components/ui/LoadingScreen";
import CircleAlertInfo from "@/components/ui/CircleAlertInfo";
import { COUNTRIES } from "@/lib/constants/countries";
import { useAuth } from "@/contexts/AuthContext";
import { useRepository } from "@/hooks/useRepository";
import type { Trip } from "@/lib/data/types";

type TripWithSpent = Trip & { spent: number };

// 게스트용 목업 데이터 (localStorage 저장소 구현 전 임시)
const MOCK_TRIPS: TripWithSpent[] = [
  {
    id: "mock-1", user_id: null, title: "일본 여행", destination: "일본",
    start_date: "2026-09-10", end_date: "2026-09-14",
    total_budget: 800000, spent: 600000, currency: "KRW",
    is_archived: false, created_at: "",
  },
  {
    id: "mock-2", user_id: null, title: "태국 여행", destination: "태국",
    start_date: "2026-07-01", end_date: "2026-07-05",
    total_budget: 500000, spent: 650000, currency: "KRW",
    is_archived: false, created_at: "",
  },
  {
    id: "mock-3", user_id: null, title: "대만 여행", destination: "대만",
    start_date: "2026-04-15", end_date: "2026-04-22",
    total_budget: 1200000, spent: 480000, currency: "KRW",
    is_archived: false, created_at: "",
  },
];

function getFlagEmoji(text: string): string {
  const match = COUNTRIES.find((c) => text.includes(c.name) || c.name.includes(text));
  return match?.emoji ?? "🌍";
}

function calcDPlus(startDate: string): string {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return `D+${Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))}`;
}

function formatDate(dateStr: string): string {
  return dateStr.replace(/-/g, ".");
}

function getNightsLabel(start: string, end: string): string {
  const nights = Math.round(
    (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24)
  );
  return nights === 0 ? "당일치기" : `${nights}박 ${nights + 1}일`;
}

export default function TravelsPage() {
  const { user, loading: authLoading } = useAuth();
  const repository = useRepository();
  const [trips, setTrips] = useState<TripWithSpent[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    // 게스트 또는 저장소 미준비 → 목업 fallback
    if (!user || !repository) {
      setTrips(MOCK_TRIPS);
      setPageLoading(false);
      return;
    }

    async function fetchData() {
      try {
        const tripList = await repository!.listTrips();
        const tripIds = tripList.map((t) => t.id);
        const expenses = tripIds.length > 0
          ? await repository!.listExpensesByTrips(tripIds)
          : [];

        const spentByTrip = new Map<string, number>();
        for (const e of expenses) {
          spentByTrip.set(e.trip_id, (spentByTrip.get(e.trip_id) ?? 0) + e.amount);
        }

        setTrips(tripList.map((t) => ({ ...t, spent: spentByTrip.get(t.id) ?? 0 })));
      } catch (err) {
        console.error("여행 목록 조회 실패:", err);
      } finally {
        setPageLoading(false);
      }
    }

    fetchData();
  }, [authLoading, user, repository]);

  if (pageLoading || authLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="relative flex min-h-screen-safe w-full flex-col bg-gray-white pb-21">
      {/* 헤더 */}
      <div className="flex items-center justify-center pb-4 pt-6">
        <span className="text-body-l font-bold text-gray-90">지난 여행</span>
      </div>

      {/* 여행 목록 */}
      <div className="flex flex-col gap-3 px-4 pt-2">
        {trips.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-20">
            <CircleAlertInfo />
            <span className="text-body-m text-gray-50">아직 등록된 여행이 없어요.</span>
          </div>
        ) : (
          trips.map((trip) => {
            const ratio = trip.total_budget > 0 ? trip.spent / trip.total_budget : 0;
            const pct = Math.round(ratio * 100);
            const isOver = pct > 100;

            return (
              <Link key={trip.id} href={`/travels/${trip.id}`}>
                <div className="flex flex-col gap-3 rounded-16 bg-gray-5 px-4 py-4">
                  {/* 국기 + 여행명 + D+N 칩 */}
                  <div className="flex items-center gap-2">
                    <span className="text-title-xl leading-none">
                      {getFlagEmoji(trip.destination ?? trip.title)}
                    </span>
                    <span className="flex-1 text-body-m font-bold text-gray-90">
                      {trip.title}
                    </span>
                    <span className="rounded-full bg-info-5 px-3 py-0.5 text-body-s font-bold text-info-50">
                      {calcDPlus(trip.start_date)}
                    </span>
                  </div>

                  {/* 기간 */}
                  <span className="text-body-s text-gray-50">
                    {formatDate(trip.start_date)} ~ {formatDate(trip.end_date)}&nbsp;·&nbsp;
                    {getNightsLabel(trip.start_date, trip.end_date)}
                  </span>

                  {/* 예산 사용률 + 진행바 */}
                  <div className="flex flex-col gap-1.5">
                    <span
                      className={`text-body-s font-medium ${
                        isOver ? "text-danger-50" : "text-gray-60"
                      }`}
                    >
                      {isOver ? `예산 ${pct - 100}% 초과` : `예산 ${pct}% 사용`}
                    </span>
                    <BudgetProgressBar ratio={ratio} />
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>

      {/* + 새 여행 버튼 (§7 디자인 미결정 → FAB 임시 적용) */}
      <FAB href="/setup" tooltipText="새로운 여행을 등록해 볼까요?" />

      <BottomNav />
    </div>
  );
}
