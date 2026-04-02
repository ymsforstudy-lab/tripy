"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import BottomNav from "@/components/layout/BottomNav";
import { supabase } from "@/lib/supabase";

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
  country: string;
  region: string | null;
  start_date: string;
  end_date: string;
  budget: number;
  currency: string;
  status: string;
};

type Expense = {
  id: string;
  trip_id: string;
  amount: number;
  currency: string;
  payment_method: string;
  category: string;
  expense_date: string;
  description: string | null;
  created_at: string;
};

export default function HomePage() {
  const router = useRouter();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/");
        return;
      }

      const { data: tripData } = await supabase
        .from("trips")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (tripData) {
        setTrip(tripData);

        const { data: expenseData } = await supabase
          .from("expenses")
          .select("*")
          .eq("trip_id", tripData.id)
          .order("created_at", { ascending: false });

        setExpenses(expenseData ?? []);
      }

      setLoading(false);
    }

    fetchData();
  }, [router]);

  const todayStr = new Date().toISOString().split("T")[0];
  const todayExpenses = expenses.filter((e) => e.expense_date === todayStr);
  const todayTotal = todayExpenses.reduce((sum, e) => sum + e.amount, 0);

  const dailyBudget = (() => {
    if (!trip) return 0;
    const start = new Date(trip.start_date);
    const end = new Date(trip.end_date);
    const days = Math.max(
      1,
      Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
    );
    return Math.floor(trip.budget / days);
  })();

  const progressRatio =
    dailyBudget > 0 ? Math.min(todayTotal / dailyBudget, 1) : 0;

  const tripDateStr = trip
    ? `${trip.start_date.replace(/-/g, ".")} ~ ${trip.end_date.replace(/-/g, ".")}`
    : "";

  const tripName = trip
    ? trip.region
      ? `${trip.region} 여행`
      : `${trip.country} 여행`
    : "";

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-sm text-gray-50">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-white pb-[80px]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pb-4 pt-6">
        <Image src="/tripy-logo.svg" alt="Tripy" width={67} height={24} />
        <button>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M4 6H20M4 12H20M4 18H20" stroke="#1D1D1D" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* 오늘 나의 예산 섹션 */}
      <div className="px-4">
        <h1 className="text-[20px] font-bold leading-[1.5] text-green-70">
          오늘 나의 예산
        </h1>

        {/* 예산 카드 */}
        <div className="mt-2 flex flex-col items-end">
          {/* 캐릭터 - 카드 위 형제 요소 */}
          <Image src="/mascot.png" alt="mascot" width={68} height={64} className="mr-2" />

          <div className="w-full rounded-[20px] border border-green-20 bg-green-10 p-4 shadow-[0px_4px_4px_0px_rgba(107,194,15,0.2)]">
            <div className="flex flex-col gap-3">
              {/* 오늘 쓴 돈 / 하루 예산 */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-gray-80">오늘 쓴 돈</span>
                  <div className="flex items-baseline gap-0.5 font-bold">
                    <span className="text-[20px] text-black">
                      {formatAmount(todayTotal)}
                    </span>
                    <span className="text-[14px] text-black">원</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[14px]">
                  <span className="text-gray-80">하루 예산</span>
                  <div className="flex gap-0.5 text-gray-60">
                    <span>{formatAmount(dailyBudget)}</span>
                    <span>원</span>
                  </div>
                </div>
              </div>

              {/* 프로그레스 바 카드 */}
              <div className="flex flex-col gap-2 rounded-xl bg-white px-[14px] py-4">
                {todayTotal === 0 ? (
                  <>
                    <span className="text-[12px] text-gray-80">
                      여행 소비를 계획해보세요.
                    </span>
                    <div className="h-[10px] rounded-[20px] bg-gray-30" />
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-1.5">
                      <span className="rounded-[8px] bg-green-0 px-1 py-0.5 text-[10px] font-bold text-green-50">
                        Good
                      </span>
                      <span className="text-[12px] text-gray-80">
                        여행 소비 아주 훌륭한데요?
                      </span>
                    </div>
                    <div className="relative h-[10px] w-full rounded-[20px] bg-gray-30">
                      <div
                        className="h-[10px] rounded-[20px] border border-[rgba(130,204,65,0.4)]"
                        style={{
                          width: `${progressRatio * 100}%`,
                          background:
                            "linear-gradient(90deg, rgba(255,255,255,0.3) 0%, rgba(33,99,28,0.3) 100%), linear-gradient(90deg, #6BC20F 0%, #6BC20F 100%)",
                        }}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 구분선 */}
      <div className="mt-6 h-2 border-t border-gray-30 bg-gray-10" />

      {/* 여행 정보 + 지출 리스트 */}
      <div className="flex flex-col gap-1.5 px-4 pt-6">
        {/* 여행 헤더 */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <span className="text-[16px] font-bold leading-[1.5] text-gray-90">
                {tripName || "여행 없음"}
              </span>
              {trip && (
                <div className="flex h-5 items-center rounded-[30px] bg-info-5 px-2 py-1">
                  <span className="text-[12px] text-info-50">진행중</span>
                </div>
              )}
            </div>
            {trip && (
              <span className="text-[12px] text-gray-50">{tripDateStr}</span>
            )}
          </div>
          {trip && (
            <button className="flex size-10 items-center justify-center rounded-xl border border-gray-50 opacity-60">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 6H16M4 10H16M4 14H16" stroke="#555555" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="7" cy="6" r="1.5" fill="white" stroke="#555555" strokeWidth="1.2" />
                <circle cx="13" cy="10" r="1.5" fill="white" stroke="#555555" strokeWidth="1.2" />
                <circle cx="9" cy="14" r="1.5" fill="white" stroke="#555555" strokeWidth="1.2" />
              </svg>
            </button>
          )}
        </div>

        {/* 지출 리스트 */}
        {expenses.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 py-16">
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
              <circle cx="28" cy="28" r="27" stroke="#D8D8D8" strokeWidth="2" />
              <circle cx="28" cy="28" r="3" fill="#8E8E8E" />
              <path d="M28 18V26" stroke="#8E8E8E" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M28 34V38" stroke="#8E8E8E" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span className="text-[14px] text-gray-50">
              아직 등록된 지출 내역이 없어요.
            </span>
          </div>
        ) : (
          <div className="mt-2 flex flex-col gap-2">
            {expenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center gap-4 overflow-hidden rounded-2xl bg-white px-2.5 py-3"
              >
                <div className="flex items-center gap-2 flex-1">
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
                  -{formatAmount(expense.amount)}원
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAB 버튼 */}
      <div className="fixed bottom-[100px] right-[calc(50%-187px)] flex items-center gap-2">
        <div className="relative flex items-center">
          <div className="rounded-[8px] bg-info-5 px-2.5 py-[5px]">
            <span className="text-[12px] text-info-50">경비를 등록해 볼까요?</span>
          </div>
          {/* 말풍선 꼬리 */}
          <div
            className="absolute right-[-6px] top-[11px] h-2 w-2 bg-info-5"
            style={{ clipPath: "polygon(0 0, 0 100%, 100% 50%)" }}
          />
        </div>
        <button
          onClick={() => router.push("/expense")}
          className="flex size-11 items-center justify-center rounded-[30px] border border-green-40 bg-green-50 shadow-md"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 5V19M5 12H19"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
