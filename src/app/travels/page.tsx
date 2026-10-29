"use client";

import Link from "next/link";
import BottomNav from "@/components/ui/BottomNav";
import FAB from "@/components/ui/FAB";
import BudgetProgressBar from "@/components/ui/BudgetProgressBar";
import { COUNTRIES } from "@/lib/constants/countries";

type MockTrip = {
  id: string;
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  total_budget: number;
  spent: number;
};

const MOCK_TRIPS: MockTrip[] = [
  {
    id: "mock-1",
    title: "일본 여행",
    destination: "일본",
    start_date: "2026-09-10",
    end_date: "2026-09-14",
    total_budget: 800000,
    spent: 600000,
  },
  {
    id: "mock-2",
    title: "태국 여행",
    destination: "태국",
    start_date: "2026-07-01",
    end_date: "2026-07-05",
    total_budget: 500000,
    spent: 650000,
  },
  {
    id: "mock-3",
    title: "대만 여행",
    destination: "대만",
    start_date: "2026-04-15",
    end_date: "2026-04-22",
    total_budget: 1200000,
    spent: 480000,
  },
];

function getFlagEmoji(destination: string): string {
  const match = COUNTRIES.find(
    (c) => destination.includes(c.name) || c.name.includes(destination)
  );
  return match?.emoji ?? "🌍";
}

function calcDPlus(startDate: string): string {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diff = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return `D+${diff}`;
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
  return (
    <div className="relative flex min-h-screen-safe w-full flex-col bg-white pb-21">
      {/* 헤더 */}
      <div className="flex items-center justify-center pb-4 pt-6">
        <span className="text-body-l font-bold text-gray-90">지난 여행</span>
      </div>

      {/* 여행 목록 */}
      <div className="flex flex-col gap-3 px-4 pt-2">
        {MOCK_TRIPS.map((trip) => {
          const ratio = trip.total_budget > 0 ? trip.spent / trip.total_budget : 0;
          const pct = Math.round(ratio * 100);
          const isOver = pct > 100;

          return (
            <Link key={trip.id} href={`/travels/${trip.id}`}>
              <div className="flex flex-col gap-3 rounded-16 bg-gray-5 px-4 py-4">
                {/* 국기 + 여행명 + D+N 칩 */}
                <div className="flex items-center gap-2">
                  <span className="text-title-xl leading-none">
                    {getFlagEmoji(trip.destination)}
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
        })}
      </div>

      {/* + 새 여행 버튼 (§7 디자인 미결정 · FAB 임시 적용) */}
      <FAB href="/setup" tooltipText="새로운 여행을 등록해 볼까요?" />

      <BottomNav />
    </div>
  );
}
