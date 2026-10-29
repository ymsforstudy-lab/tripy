"use client";

import { useRouter, useParams } from "next/navigation";
import Header from "@/components/ui/Header";
import BottomNav from "@/components/ui/BottomNav";
import BudgetProgressBar from "@/components/ui/BudgetProgressBar";
import CategoryIcon from "@/components/ui/CategoryIcon";
import CircleAlertInfo from "@/components/ui/CircleAlertInfo";
import { COUNTRIES } from "@/lib/constants/countries";
import { CATEGORY_MAP } from "@/lib/constants/categories";
import { getCurrencyUnit } from "@/lib/constants/currency";

// ── 타입 ──────────────────────────────────────────────────────────────────────

type MockTrip = {
  id: string;
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  total_budget: number;
  currency: string;
};

type MockExpense = {
  id: string;
  trip_id: string;
  amount: number;
  currency: string;
  category: string;
  expense_date: string;
  description: string | null;
};

// ── 목업 데이터 ────────────────────────────────────────────────────────────────

const MOCK_TRIPS: Record<string, MockTrip> = {
  "mock-1": {
    id: "mock-1",
    title: "일본 여행",
    destination: "일본",
    start_date: "2026-09-10",
    end_date: "2026-09-14",
    total_budget: 800000,
    currency: "KRW",
  },
  "mock-2": {
    id: "mock-2",
    title: "태국 여행",
    destination: "태국",
    start_date: "2026-07-01",
    end_date: "2026-07-05",
    total_budget: 500000,
    currency: "KRW",
  },
  "mock-3": {
    id: "mock-3",
    title: "대만 여행",
    destination: "대만",
    start_date: "2026-04-15",
    end_date: "2026-04-22",
    total_budget: 1200000,
    currency: "KRW",
  },
};

const MOCK_EXPENSES: Record<string, MockExpense[]> = {
  "mock-1": [
    { id: "e1-1", trip_id: "mock-1", amount: 150000, currency: "KRW", category: "accommodation", expense_date: "2026-09-10", description: "숙소 1박" },
    { id: "e1-2", trip_id: "mock-1", amount: 30000,  currency: "KRW", category: "transport",     expense_date: "2026-09-10", description: "공항 리무진" },
    { id: "e1-3", trip_id: "mock-1", amount: 25000,  currency: "KRW", category: "food",          expense_date: "2026-09-11", description: "라멘" },
    { id: "e1-4", trip_id: "mock-1", amount: 100000, currency: "KRW", category: "shopping",      expense_date: "2026-09-11", description: "돈키호테" },
    { id: "e1-5", trip_id: "mock-1", amount: 80000,  currency: "KRW", category: "activity",      expense_date: "2026-09-12", description: "유니버셜 스튜디오" },
    { id: "e1-6", trip_id: "mock-1", amount: 20000,  currency: "KRW", category: "food",          expense_date: "2026-09-12", description: "타코야키" },
    { id: "e1-7", trip_id: "mock-1", amount: 35000,  currency: "KRW", category: "food",          expense_date: "2026-09-13", description: "오므라이스" },
    { id: "e1-8", trip_id: "mock-1", amount: 50000,  currency: "KRW", category: "shopping",      expense_date: "2026-09-13", description: "기념품" },
    { id: "e1-9", trip_id: "mock-1", amount: 110000, currency: "KRW", category: "transport",     expense_date: "2026-09-14", description: "간사이 공항 라피트" },
  ],
  "mock-2": [
    { id: "e2-1", trip_id: "mock-2", amount: 100000, currency: "KRW", category: "accommodation", expense_date: "2026-07-01", description: "방콕 호텔" },
    { id: "e2-2", trip_id: "mock-2", amount: 20000,  currency: "KRW", category: "transport",     expense_date: "2026-07-01", description: "그랩" },
    { id: "e2-3", trip_id: "mock-2", amount: 30000,  currency: "KRW", category: "food",          expense_date: "2026-07-02", description: "팟타이" },
    { id: "e2-4", trip_id: "mock-2", amount: 120000, currency: "KRW", category: "activity",      expense_date: "2026-07-02", description: "왓포 투어" },
    { id: "e2-5", trip_id: "mock-2", amount: 200000, currency: "KRW", category: "shopping",      expense_date: "2026-07-03", description: "짜뚜짝 시장" },
    { id: "e2-6", trip_id: "mock-2", amount: 25000,  currency: "KRW", category: "food",          expense_date: "2026-07-03", description: "망고 빙수" },
    { id: "e2-7", trip_id: "mock-2", amount: 40000,  currency: "KRW", category: "food",          expense_date: "2026-07-04", description: "해산물 BBQ" },
    { id: "e2-8", trip_id: "mock-2", amount: 50000,  currency: "KRW", category: "activity",      expense_date: "2026-07-04", description: "태국 마사지" },
    { id: "e2-9", trip_id: "mock-2", amount: 65000,  currency: "KRW", category: "transport",     expense_date: "2026-07-05", description: "수완나품 공항" },
  ],
  "mock-3": [
    { id: "e3-1", trip_id: "mock-3", amount: 100000, currency: "KRW", category: "accommodation", expense_date: "2026-04-15", description: "타이페이 호텔" },
    { id: "e3-2", trip_id: "mock-3", amount: 20000,  currency: "KRW", category: "food",          expense_date: "2026-04-16", description: "딘타이펑" },
    { id: "e3-3", trip_id: "mock-3", amount: 15000,  currency: "KRW", category: "transport",     expense_date: "2026-04-16", description: "MRT" },
    { id: "e3-4", trip_id: "mock-3", amount: 80000,  currency: "KRW", category: "activity",      expense_date: "2026-04-17", description: "지우펀 투어" },
    { id: "e3-5", trip_id: "mock-3", amount: 50000,  currency: "KRW", category: "shopping",      expense_date: "2026-04-17", description: "야시장" },
    { id: "e3-6", trip_id: "mock-3", amount: 25000,  currency: "KRW", category: "food",          expense_date: "2026-04-18", description: "스테이크" },
    { id: "e3-7", trip_id: "mock-3", amount: 10000,  currency: "KRW", category: "etc",           expense_date: "2026-04-18", description: "기타" },
    { id: "e3-8", trip_id: "mock-3", amount: 30000,  currency: "KRW", category: "food",          expense_date: "2026-04-19", description: "로컬 식당" },
    { id: "e3-9", trip_id: "mock-3", amount: 70000,  currency: "KRW", category: "shopping",      expense_date: "2026-04-20", description: "광화문 기념품" },
    { id: "e3-10", trip_id: "mock-3", amount: 30000, currency: "KRW", category: "food",          expense_date: "2026-04-21", description: "야식" },
    { id: "e3-11", trip_id: "mock-3", amount: 20000, currency: "KRW", category: "transport",     expense_date: "2026-04-21", description: "버스" },
    { id: "e3-12", trip_id: "mock-3", amount: 30000, currency: "KRW", category: "transport",     expense_date: "2026-04-22", description: "타오위안 공항" },
  ],
};

// ── 유틸 ──────────────────────────────────────────────────────────────────────

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

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  return `${month}.${day} (${dayNames[d.getDay()]})`;
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
  expenses: MockExpense[];
  total: number;
};

function groupByDay(expenses: MockExpense[], startDate: string): DayGroup[] {
  const map = new Map<string, MockExpense[]>();
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

// ── 필터 아이콘 (장식) ────────────────────────────────────────────────────────

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

  const trip = MOCK_TRIPS[id];
  const expenses = MOCK_EXPENSES[id] ?? [];

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
          <span className="text-title-xl leading-none">{getFlagEmoji(trip.destination)}</span>
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
          {/* 총 지출 / 남은 금액 */}
          <div className="flex justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="text-body-s text-gray-50">총 지출</span>
              <div className="flex items-baseline gap-0.5">
                <span className="text-body-l font-bold text-gray-90">
                  {formatAmount(totalSpent)}
                </span>
                <span className="text-body-s text-gray-90">{unit}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-0.5">
              <span className="text-body-s text-gray-50">남은 금액</span>
              <div className="flex items-baseline gap-0.5">
                <span
                  className={`text-body-l font-bold ${
                    remaining < 0 ? "text-danger-50" : "text-gray-90"
                  }`}
                >
                  {remaining < 0 ? "-" : ""}
                  {formatAmount(Math.abs(remaining))}
                </span>
                <span
                  className={`text-body-s ${
                    remaining < 0 ? "text-danger-50" : "text-gray-90"
                  }`}
                >
                  {unit}
                </span>
              </div>
            </div>
          </div>

          {/* 진행바 */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-body-s text-gray-50">
                총 예산 {formatAmount(trip.total_budget)}{unit}
              </span>
              <span
                className={`text-body-s font-medium ${
                  isOver ? "text-danger-50" : "text-gray-60"
                }`}
              >
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
        {/* 섹션 헤더 */}
        <div className="flex items-center justify-between">
          <span className="text-body-m font-bold text-gray-90">지출 내역</span>
          <button aria-label="필터">
            <FilterIcon />
          </button>
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
                {/* N일 차 헤더 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-body-s font-bold text-gray-70">
                      {dayIndex}일 차
                    </span>
                    <span className="text-body-s text-gray-50">
                      {formatDateLabel(date)}
                    </span>
                  </div>
                  <span className="text-body-s text-gray-60">
                    합계 {formatAmount(total)}{unit}
                  </span>
                </div>

                {/* 지출 항목 */}
                {dayExps.map((expense) => (
                  <div
                    key={expense.id}
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
                        <span className="text-body-s text-gray-50">
                          {expense.description}
                        </span>
                      )}
                    </div>
                    <span className="text-body-m font-medium text-gray-90">
                      -{formatAmount(expense.amount)}{unit}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
