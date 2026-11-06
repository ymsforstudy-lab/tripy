"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";
import { useTrip } from "@/contexts/TripContext";
import { useRepository } from "@/hooks/useRepository";
import type { TripRepository } from "@/lib/data/repository";
import type { Expense } from "@/lib/data/types";
import HomeHeader from "@/components/ui/HomeHeader";
import BudgetCard from "@/components/ui/BudgetCard";
import HomeFilter from "@/components/ui/HomeFilter";
import FilterCategory from "@/components/ui/FilterCategory";
import { getCurrencyUnit } from "@/lib/constants/currency";
import CategoryIcon from "@/components/ui/CategoryIcon";
import FAB from "@/components/ui/FAB";
import CircleAlertInfo from "@/components/ui/CircleAlertInfo";
import LoadingScreen from "@/components/ui/LoadingScreen";
import Toast from "@/components/ui/Toast";
import { useExchangeRates } from "@/hooks/useExchangeRates";
import { convertExpensesToBaseCurrency, FALLBACK_RATES } from "@/lib/exchange-rates";

const CATEGORY_LABEL: Record<string, string> = {
  accommodation: "숙소",
  food: "식비",
  transport: "교통",
  activity: "액티비티",
  shopping: "쇼핑",
  etc: "기타",
};

function formatAmount(amount: number) {
  return amount.toLocaleString("ko-KR");
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  const dayName = dayNames[d.getDay()];
  return `${month}.${day} (${dayName})`;
}

/** 어떤 저장소·여행으로 불러온 지출인지 함께 보관해 여행이 바뀌면 이전 결과를 쓰지 않는다 */
type ExpenseResult = {
  repo: TripRepository;
  tripId: string;
  expenses: Expense[];
};

export default function HomePage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <HomePageContent />
    </Suspense>
  );
}


function HomePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { trip, loading: tripLoading, refresh: refreshTrip } = useTrip();
  const repository = useRepository();
  const { rates } = useExchangeRates();
  const [expenseResult, setExpenseResult] = useState<ExpenseResult | null>(null);
  const [minLoadDone, setMinLoadDone] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMinLoadDone(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (searchParams.get("toast") === "expense") {
      setToastVisible(true);
      refreshTrip();
      const timer = setTimeout(() => setToastVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, refreshTrip]);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // 홈 여행이 없으면 여행 정보 입력으로 보낸다. 로딩 중에는 판단하지 않는다
  useEffect(() => {
    if (!tripLoading && !trip) router.replace("/setup");
  }, [tripLoading, trip, router]);

  // 로그인 사용자는 Supabase, 게스트는 이 기기(localStorage)에서 지출을 불러온다
  useEffect(() => {
    if (tripLoading || !trip || !repository) return;
    let cancelled = false;
    const tripId = trip.id;
    repository
      .listExpenses(tripId)
      .catch((e) => {
        console.error("지출 내역 조회 실패:", e);
        return [] as Expense[];
      })
      .then((expenses) => {
        if (!cancelled) setExpenseResult({ repo: repository, tripId, expenses });
      });
    return () => {
      cancelled = true;
    };
  }, [tripLoading, trip, repository]);

  const expenseReady =
    !!trip && expenseResult?.repo === repository && expenseResult?.tripId === trip.id;
  const expenses = expenseReady ? expenseResult.expenses : [];
  const loading = tripLoading || !expenseReady;

  const filteredExpenses =
    selectedCategories.length > 0
      ? expenses.filter((e) => selectedCategories.includes(e.category))
      : expenses;

  const nights = trip
    ? Math.max(
        0,
        Math.round(
          (new Date(trip.end_date).getTime() - new Date(trip.start_date).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      )
    : 0;

  // 오늘 쓴 돈 — 기기 로컬 날짜 기준 (toISOString은 UTC라 KST 오전 9시 전엔 전날이 된다)
  const now = new Date();
  const localToday = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const baseCurrency = trip?.currency ?? "KRW";
  const todaySpent = convertExpensesToBaseCurrency(
    expenses.filter((e) => e.expense_date === localToday),
    baseCurrency,
    rates ?? FALLBACK_RATES
  );

  // 하루 예산 — 총예산을 여행 일수(박 + 1)로 균등 분배
  const dailyBudget = Math.round((trip?.total_budget ?? 0) / (nights + 1));
  const progressRatio = dailyBudget > 0 ? todaySpent / dailyBudget : 0;

  const tripDateStr = trip
    ? `${trip.start_date.replace(/-/g, ".")} ~ ${trip.end_date.replace(/-/g, ".")}`
    : "";

  const nightsLabel = !trip ? "" : nights === 0 ? "당일치기" : `${nights}박 ${nights + 1}일`;

  const tripName = trip ? trip.title : "";

  if (loading || !minLoadDone) {
    return <LoadingScreen />;
  }

  return (
    <div className="relative flex min-h-screen-safe w-full flex-col bg-white pb-[84px]">
      <HomeHeader />

      <div className="mt-4">
        <BudgetCard
          todaySpent={todaySpent}
          dailyBudget={dailyBudget}
          progressRatio={progressRatio}
          currency={trip?.currency}
        />
      </div>

      {/* 구분선 */}
      <div className="mt-6 h-2 w-full border-t border-gray-30 bg-gray-10" />

      {/* 여행 정보 + 지출 리스트 */}
      <div className="relative flex flex-col gap-[6px] px-4 pt-6 pb-20">
        <HomeFilter
          tripName={tripName}
          hasTrip={!!trip}
          dateRange={tripDateStr}
          nightsLabel={nightsLabel}
          onFilterClick={() => setIsFilterOpen(!isFilterOpen)}
        />

        {isFilterOpen && (
          <FilterCategory
            selectedCategories={selectedCategories}
            onToggle={(id) => {
              setSelectedCategories((prev) =>
                prev.includes(id)
                  ? prev.filter((c) => c !== id)
                  : [...prev, id]
              );
            }}
            onClose={() => setIsFilterOpen(false)}
          />
        )}

        {/* 지출 리스트 */}
        {filteredExpenses.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 py-16">
            <CircleAlertInfo />
            <span className="text-body-m text-gray-50">
              아직 등록된 지출 내역이 없어요.
            </span>
          </div>
        ) : (
          <div className="mt-2 flex flex-col gap-2">
            {filteredExpenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center gap-4 overflow-hidden rounded-2xl bg-white px-2.5 py-3"
              >
                <div className="flex flex-1 items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-info-5">
                    <CategoryIcon category={expense.category} size={20} />
                  </div>
                  <div className="flex flex-col leading-default">
                    <span className="text-body-m font-bold text-gray-90">
                      {CATEGORY_LABEL[expense.category] ?? expense.category}
                    </span>
                    <span className="text-body-s text-gray-50">
                      {formatDate(expense.expense_date)}
                    </span>
                  </div>
                </div>
                <span className="text-body-m font-medium text-gray-90">
                  -{formatAmount(expense.amount)}{getCurrencyUnit(expense.currency)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAB 버튼 */}
      <FAB href="/expense" tooltipText="경비를 등록해 볼까요?" />

      <Toast message="경비 등록이 완료되었습니다." visible={toastVisible} />

      <BottomNav />
    </div>
  );
}
