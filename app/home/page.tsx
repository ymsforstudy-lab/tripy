"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BottomNav from "@/components/layout/BottomNav";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useTrip } from "@/contexts/TripContext";
import HomeHeader from "@/components/home/HomeHeader";
import BudgetCard from "@/components/home/BudgetCard";
import HomeFilter from "@/components/home/HomeFilter";
import FilterCategory from "@/components/home/FilterCategory";
import { getCurrencyUnit } from "@/lib/constants/currency";

const CATEGORY_EMOJI: Record<string, string> = {
  accommodation: "🏠",
  food: "🍴",
  transport: "🚌",
  activity: "🎿",
  shopping: "🛍️",
  etc: "➕",
};

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

type Trip = {
  id: string;
  user_id: string;
  title: string;
  destination: string | null;
  start_date: string;
  end_date: string;
  total_budget: number;
  currency: string;
  is_archived: boolean;
};

type Expense = {
  id: string;
  trip_id: string;
  amount: number;
  currency: string;
  category: string;
  expense_date: string;
  description: string | null;
  created_at: string;
};

const DUMMY_TRIP: Trip = {
  id: "dummy-trip-1",
  user_id: "user-1",
  title: "일본 여행",
  destination: "오사카",
  start_date: "2024-03-20",
  end_date: "2024-03-25",
  total_budget: 1000000,
  currency: "KRW",
  is_archived: false,
};

const todayStr = new Date().toISOString().split("T")[0];
const LOCAL_EXPENSES_KEY = "tripy_dummy_expenses";

function readLocalExpenses(): Expense[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LOCAL_EXPENSES_KEY);
    return raw ? (JSON.parse(raw) as Expense[]) : [];
  } catch {
    return [];
  }
}

const DUMMY_EXPENSES: Expense[] = [
  {
    id: "exp-1",
    trip_id: "dummy-trip-1",
    amount: 15000,
    currency: "KRW",
    category: "food",
    expense_date: todayStr,
    description: "라멘",
    created_at: new Date().toISOString(),
  },
  {
    id: "exp-2",
    trip_id: "dummy-trip-1",
    amount: 50000,
    currency: "KRW",
    category: "shopping",
    expense_date: todayStr,
    description: "돈키호테",
    created_at: new Date().toISOString(),
  },
];

export default function HomePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { trip: cachedTrip, loading: tripLoading } = useTrip();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    if (authLoading || tripLoading) return;

    if (!user) {
      setTrip(DUMMY_TRIP);
      setExpenses([...readLocalExpenses(), ...DUMMY_EXPENSES]);
      setLoading(false);
      return;
    }

    if (!cachedTrip) {
      router.replace("/setup");
      return;
    }

    setTrip(cachedTrip as Trip);

    async function fetchExpenses() {
      const { data: expenseData } = await supabase
        .from("expenses")
        .select("*")
        .eq("trip_id", cachedTrip!.id)
        .order("created_at", { ascending: false });

      setExpenses(expenseData ?? []);
      setLoading(false);
    }

    fetchExpenses();
  }, [authLoading, tripLoading, user, cachedTrip, router]);

  const filteredExpenses =
    selectedCategories.length > 0
      ? expenses.filter((e) => selectedCategories.includes(e.category))
      : expenses;

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  const totalBudget = trip?.total_budget ?? 0;
  const progressRatio = totalBudget > 0 ? totalSpent / totalBudget : 0;

  const tripDateStr = trip
    ? `${trip.start_date.replace(/-/g, ".")} ~ ${trip.end_date.replace(/-/g, ".")}`
    : "";

  const nightsLabel = (() => {
    if (!trip) return "";
    const start = new Date(trip.start_date);
    const end = new Date(trip.end_date);
    const nights = Math.max(
      0,
      Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    );
    if (nights === 0) return "당일치기";
    return `${nights}박 ${nights + 1}일`;
  })();

  const tripName = trip ? trip.title : "";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-sm text-gray-50">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-[375px] flex-col bg-white pb-[84px] shadow-sm">
      <HomeHeader />

      <div className="mt-4">
        <BudgetCard
          totalSpent={totalSpent}
          totalBudget={totalBudget}
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
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
              <circle cx="28" cy="28" r="27" stroke="#D8D8D8" strokeWidth="2" />
              <circle cx="28" cy="20" r="2.5" fill="#8E8E8E" />
              <path d="M28 27V39" stroke="#8E8E8E" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span className="text-[14px] text-gray-50">
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
                  <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-info-5 text-[20px]">
                    {CATEGORY_EMOJI[expense.category] ?? "💰"}
                  </div>
                  <div className="flex flex-col leading-[1.5]">
                    <span className="text-[14px] font-bold text-gray-90">
                      {CATEGORY_LABEL[expense.category] ?? expense.category}
                    </span>
                    <span className="text-[12px] text-gray-50">
                      {formatDate(expense.expense_date)}
                    </span>
                  </div>
                </div>
                <span className="text-[14px] font-medium text-gray-90">
                  -{formatAmount(expense.amount)}{getCurrencyUnit(expense.currency)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAB 버튼 */}
      <div className="pointer-events-none fixed bottom-[100px] left-1/2 z-40 w-[375px] -translate-x-1/2 px-4">
        <div className="relative flex w-full justify-end">
          <div className="pointer-events-auto flex items-center gap-2">
            <div className="relative flex items-center">
              <div className="rounded-[8px] bg-info-5 px-[10px] py-[5px]">
                <span className="text-[12px] text-info-50">
                  경비를 등록해 볼까요?
                </span>
              </div>
              <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 flex h-2 w-2 items-center justify-center">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <circle cx="4" cy="4" r="4" fill="#E9F0FF" />
                </svg>
              </div>
            </div>
            <Link
              href="/expense"
              className="flex size-11 items-center justify-center rounded-[30px] border border-green-40 bg-green-50 shadow-md"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 5V19M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
