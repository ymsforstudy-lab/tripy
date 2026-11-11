"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { useTrip } from "@/contexts/TripContext";
import { useRepository } from "@/hooks/useRepository";
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
import type { Expense } from "@/lib/data/types";

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
  const { loading: authLoading } = useAuth();
  const { trip: cachedTrip, loading: tripLoading, refresh: refreshTrip } = useTrip();
  const repository = useRepository();
  const { rates } = useExchangeRates();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastVisible, setToastVisible] = useState(false);

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

  useEffect(() => {
    if (authLoading || tripLoading || !repository) return;

    if (!cachedTrip) {
      router.replace("/setup");
      return;
    }

    async function fetchExpenses() {
      try {
        const data = await repository!.listExpenses(cachedTrip!.id);
        setExpenses(data);
      } catch (err) {
        console.error("지출 내역 조회 실패:", err);
        setExpenses([]);
      }
      setLoading(false);
    }

    fetchExpenses();
  }, [authLoading, tripLoading, repository, cachedTrip, router]);

  const filteredExpenses =
    selectedCategories.length > 0
      ? expenses.filter((e) => selectedCategories.includes(e.category))
      : expenses;

  const trip = cachedTrip;
  const nights = trip
    ? Math.max(
        0,
        Math.round(
          (new Date(trip.end_date).getTime() - new Date(trip.start_date).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      )
    : 0;

  const now = new Date();
  const localToday = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const baseCurrency = trip?.currency ?? "KRW";
  const effectiveRates = rates ?? FALLBACK_RATES;

  const todaySpent = convertExpensesToBaseCurrency(
    expenses.filter((e) => e.expense_date === localToday),
    baseCurrency,
    effectiveRates
  );

  const totalSpent = convertExpensesToBaseCurrency(expenses, baseCurrency, effectiveRates);
  const totalBudget = trip?.total_budget ?? 0;
  const remaining = totalBudget - totalSpent;
  const progressRatio = totalBudget > 0 ? totalSpent / totalBudget : 0;

  const tripDateStr = trip
    ? `${trip.start_date.replace(/-/g, ".")} ~ ${trip.end_date.replace(/-/g, ".")}`
    : "";
  const nightsLabel = !trip ? "" : nights === 0 ? "당일치기" : `${nights}박 ${nights + 1}일`;
  const tripName = trip?.title ?? "";
  const unit = getCurrencyUnit(trip?.currency);

  if (loading || authLoading || tripLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="relative flex min-h-screen-safe w-full flex-col bg-white pb-[84px]">
      <HomeHeader />

      <BudgetCard
        tripName={tripName}
        tripDateStr={tripDateStr}
        nightsLabel={nightsLabel}
        todaySpent={todaySpent}
        remaining={remaining}
        totalBudget={totalBudget}
        progressRatio={progressRatio}
        currency={trip?.currency}
      />

      {/* 구분선 */}
      <div className="mt-6 h-2 w-full border-t border-gray-30 bg-gray-10" />

      {/* 지출 내역 */}
      <div className="relative flex flex-col gap-1.5 px-4 pt-6 pb-20">
        <HomeFilter onFilterClick={() => setIsFilterOpen(!isFilterOpen)} />

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
                className="flex items-center gap-4 overflow-hidden rounded-16 bg-white px-2.5 py-3"
                onClick={() => router.push(`/expense?expenseId=${expense.id}&from=/home`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter") router.push(`/expense?expenseId=${expense.id}&from=/home`); }}
              >
                <div className="flex flex-1 items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-8 bg-info-5">
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
                  -{formatAmount(expense.amount)}{unit}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <FAB href="/expense" tooltipText="경비를 등록해 볼까요?" />

      <Toast message="경비 등록이 완료되었습니다." visible={toastVisible} />

      <BottomNav />
    </div>
  );
}
