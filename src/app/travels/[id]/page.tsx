"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/ui/Header";
import BottomNav from "@/components/ui/BottomNav";
import BudgetProgressBar from "@/components/ui/BudgetProgressBar";
import CategoryIcon from "@/components/ui/CategoryIcon";
import CircleAlertInfo from "@/components/ui/CircleAlertInfo";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { COUNTRIES } from "@/lib/constants/countries";
import { CATEGORY_MAP } from "@/lib/constants/categories";
import { getCurrencyUnit } from "@/lib/constants/currency";
import { useAuth } from "@/contexts/AuthContext";
import { useRepository } from "@/hooks/useRepository";
import type { Trip, Expense } from "@/lib/data/types";

// ── 유틸 ──────────────────────────────────────────────────────────────────────

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

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr);
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  return `${d.getMonth() + 1}.${d.getDate()} (${dayNames[d.getDay()]})`;
}

function getNightsLabel(start: string, end: string): string {
  const nights = Math.round(
    (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24)
  );
  return nights === 0 ? "당일치기" : `${nights}박 ${nights + 1}일`;
}

function formatAmount(amount: number): string {
  return amount.toLocaleString("ko-KR");
}

function getDayIndex(startDate: string, expenseDate: string): number {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const exp = new Date(expenseDate);
  exp.setHours(0, 0, 0, 0);
  return Math.floor((exp.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}

type DayGroup = {
  date: string;
  dayIndex: number;
  expenses: Expense[];
  total: number;
};

function groupByDay(expenses: Expense[], startDate: string): DayGroup[] {
  const map = new Map<string, Expense[]>();
  for (const e of expenses) {
    const list = map.get(e.expense_date) ?? [];
    list.push(e);
    map.set(e.expense_date, list);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, exps]) => ({
      date,
      dayIndex: getDayIndex(startDate, date),
      expenses: exps,
      total: exps.reduce((s, e) => s + e.amount, 0),
    }));
}

function FilterIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M2.5 5h15M5.5 10h9M8.5 15h3"
        stroke="var(--color-gray-60)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ── 페이지 ────────────────────────────────────────────────────────────────────

export default function TravelDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { loading: authLoading } = useAuth();
  const repository = useRepository();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!repository) {
      setPageLoading(false);
      return;
    }

    async function fetchData() {
      try {
        const [tripData, expenseData] = await Promise.all([
          repository!.getTrip(id),
          repository!.listExpenses(id),
        ]);
        setTrip(tripData);
        setExpenses(expenseData);
      } catch (err) {
        console.error("여행 상세 조회 실패:", err);
      } finally {
        setPageLoading(false);
      }
    }

    fetchData();
  }, [authLoading, repository, id]);

  if (pageLoading || authLoading) {
    return <LoadingScreen />;
  }

  if (!trip) {
    return (
      <div className="flex min-h-screen-safe flex-col bg-gray-white">
        <Header onBack={() => router.push("/travels")} />
        <div className="flex flex-1 flex-col items-center justify-center gap-2 py-16">
          <CircleAlertInfo />
          <span className="text-body-m text-gray-50">여행을 찾을 수 없어요.</span>
        </div>
        <BottomNav />
      </div>
    );
  }

  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const remaining = trip.total_budget - totalSpent;
  const ratio = trip.total_budget > 0 ? totalSpent / trip.total_budget : 0;
  const pct = Math.round(ratio * 100);
  const isOver = pct > 100;
  const unit = getCurrencyUnit(trip.currency);
  const dayGroups = groupByDay(expenses, trip.start_date);

  return (
    <div className="relative flex min-h-screen-safe w-full flex-col bg-gray-white pb-21">
      {/* 헤더 */}
      <Header onBack={() => router.push("/travels")} />

      {/* 여행 정보 */}
      <div className="flex flex-col gap-1.5 px-4 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-title-xl leading-none">
            {getFlagEmoji(trip.destination ?? trip.title)}
          </span>
          <span className="text-title-m font-bold text-gray-90">{trip.title}</span>
          <span className="rounded-full bg-info-5 px-3 py-0.5 text-body-s font-bold text-info-50">
            {calcDPlus(trip.start_date)}
          </span>
        </div>
        <span className="text-body-s text-gray-50">
          {formatDate(trip.start_date)} ~ {formatDate(trip.end_date)}&nbsp;·&nbsp;
          {getNightsLabel(trip.start_date, trip.end_date)}
        </span>
      </div>

      {/* 예산 요약 카드 */}
      <div className="px-4 pb-6">
        <div className="flex flex-col gap-3 rounded-16 bg-gray-5 px-4 py-4">
          <div className="flex justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="text-body-s text-gray-50">총 지출</span>
              <div className="flex items-baseline gap-0.5">
                <span className="text-body-l font-bold text-gray-90">{formatAmount(totalSpent)}</span>
                <span className="text-body-s text-gray-90">{unit}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-0.5">
              <span className="text-body-s text-gray-50">남은 금액</span>
              <div className="flex items-baseline gap-0.5">
                <span className={`text-body-l font-bold ${remaining < 0 ? "text-danger-50" : "text-gray-90"}`}>
                  {remaining < 0 ? "-" : ""}{formatAmount(Math.abs(remaining))}
                </span>
                <span className={`text-body-s ${remaining < 0 ? "text-danger-50" : "text-gray-90"}`}>
                  {unit}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-body-s text-gray-50">
                총 예산 {formatAmount(trip.total_budget)}{unit}
              </span>
              <span className={`text-body-s font-medium ${isOver ? "text-danger-50" : "text-gray-60"}`}>
                {isOver ? `예산 ${pct - 100}% 초과` : `예산 ${pct}% 사용`}
              </span>
            </div>
            <BudgetProgressBar ratio={ratio} />
          </div>
        </div>
      </div>

      {/* 구분선 */}
      <div className="h-2 w-full border-t border-gray-10 bg-gray-10" />

      {/* 지출 내역 */}
      <div className="flex flex-col gap-4 px-4 pt-6">
        <div className="flex items-center justify-between">
          <span className="text-body-m font-bold text-gray-90">지출 내역</span>
          <button aria-label="필터"><FilterIcon /></button>
        </div>

        {expenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16">
            <CircleAlertInfo />
            <span className="text-body-m text-gray-50">아직 등록된 지출 내역이 없어요.</span>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {dayGroups.map(({ date, dayIndex, expenses: dayExps, total }) => (
              <div key={date} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-body-s font-bold text-gray-70">{dayIndex}일 차</span>
                    <span className="text-body-s text-gray-50">{formatDateLabel(date)}</span>
                  </div>
                  <span className="text-body-s text-gray-60">합계 {formatAmount(total)}{unit}</span>
                </div>
                {dayExps.map((expense) => (
                  <Link
                    key={expense.id}
                    href={`/expense?expenseId=${expense.id}&from=${encodeURIComponent(`/travels/${id}`)}`}
                    className="flex items-center gap-3 rounded-16 bg-gray-white px-3 py-3 shadow-card"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-8 bg-info-5">
                      <CategoryIcon category={expense.category} size={20} />
                    </div>
                    <div className="flex flex-1 flex-col leading-default">
                      <span className="text-body-m font-bold text-gray-90">
                        {CATEGORY_MAP[expense.category as keyof typeof CATEGORY_MAP]?.label ?? expense.category}
                      </span>
                      {expense.description && (
                        <span className="text-body-s text-gray-50">{expense.description}</span>
                      )}
                    </div>
                    <span className="text-body-m font-medium text-gray-90">
                      -{formatAmount(expense.amount)}{unit}
                    </span>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
