"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/ui/Header";
import CalendarModal from "@/components/ui/CalendarModal";
import ExchangeDropdown from "@/components/ui/ExchangeDropdown";
import DeleteConfirmModal from "@/components/ui/DeleteConfirmModal";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useTrip } from "@/contexts/TripContext";
import { type Currency } from "@/lib/constants/currency";
import CategoryIcon from "@/components/ui/CategoryIcon";
import { useKeyboardInset } from "@/hooks/useKeyboardInset";

type Tab = "expense" | "budget";
type PaymentMethod = "card" | "cash";

const CATEGORIES = [
  { id: "accommodation", label: "숙소" },
  { id: "food", label: "식비" },
  { id: "transport", label: "교통" },
  { id: "activity", label: "액티비티" },
  { id: "shopping", label: "쇼핑" },
  { id: "etc", label: "기타" },
] as const;

// ── 목업 지출 조회 (travels/[id] 목업 데이터와 동기화) ─────────────────────────

type MockExpenseLookup = {
  amount: number;
  currency: string;
  category: string;
  expense_date: string;
  description: string | null;
};

const MOCK_EXPENSE_LOOKUP: Record<string, MockExpenseLookup> = {
  "e1-1": { amount: 150000, currency: "KRW", category: "accommodation", expense_date: "2026-09-10", description: "숙소 1박" },
  "e1-2": { amount: 30000,  currency: "KRW", category: "transport",     expense_date: "2026-09-10", description: "공항 리무진" },
  "e1-3": { amount: 25000,  currency: "KRW", category: "food",          expense_date: "2026-09-11", description: "라멘" },
  "e1-4": { amount: 100000, currency: "KRW", category: "shopping",      expense_date: "2026-09-11", description: "돈키호테" },
  "e1-5": { amount: 80000,  currency: "KRW", category: "activity",      expense_date: "2026-09-12", description: "유니버셜 스튜디오" },
  "e1-6": { amount: 20000,  currency: "KRW", category: "food",          expense_date: "2026-09-12", description: "타코야키" },
  "e1-7": { amount: 35000,  currency: "KRW", category: "food",          expense_date: "2026-09-13", description: "오므라이스" },
  "e1-8": { amount: 50000,  currency: "KRW", category: "shopping",      expense_date: "2026-09-13", description: "기념품" },
  "e1-9": { amount: 110000, currency: "KRW", category: "transport",     expense_date: "2026-09-14", description: "간사이 공항 라피트" },
  "e2-1": { amount: 100000, currency: "KRW", category: "accommodation", expense_date: "2026-07-01", description: "방콕 호텔" },
  "e2-2": { amount: 20000,  currency: "KRW", category: "transport",     expense_date: "2026-07-01", description: "그랩" },
  "e2-3": { amount: 30000,  currency: "KRW", category: "food",          expense_date: "2026-07-02", description: "팟타이" },
  "e2-4": { amount: 120000, currency: "KRW", category: "activity",      expense_date: "2026-07-02", description: "왓포 투어" },
  "e2-5": { amount: 200000, currency: "KRW", category: "shopping",      expense_date: "2026-07-03", description: "짜뚜짝 시장" },
  "e2-6": { amount: 25000,  currency: "KRW", category: "food",          expense_date: "2026-07-03", description: "망고 빙수" },
  "e2-7": { amount: 40000,  currency: "KRW", category: "food",          expense_date: "2026-07-04", description: "해산물 BBQ" },
  "e2-8": { amount: 50000,  currency: "KRW", category: "activity",      expense_date: "2026-07-04", description: "태국 마사지" },
  "e2-9": { amount: 65000,  currency: "KRW", category: "transport",     expense_date: "2026-07-05", description: "수완나품 공항" },
  "e3-1": { amount: 100000, currency: "KRW", category: "accommodation", expense_date: "2026-04-15", description: "타이페이 호텔" },
  "e3-2": { amount: 20000,  currency: "KRW", category: "food",          expense_date: "2026-04-16", description: "딘타이펑" },
  "e3-3": { amount: 15000,  currency: "KRW", category: "transport",     expense_date: "2026-04-16", description: "MRT" },
  "e3-4": { amount: 80000,  currency: "KRW", category: "activity",      expense_date: "2026-04-17", description: "지우펀 투어" },
  "e3-5": { amount: 50000,  currency: "KRW", category: "shopping",      expense_date: "2026-04-17", description: "야시장" },
  "e3-6": { amount: 25000,  currency: "KRW", category: "food",          expense_date: "2026-04-18", description: "스테이크" },
  "e3-7": { amount: 10000,  currency: "KRW", category: "etc",           expense_date: "2026-04-18", description: "기타" },
  "e3-8": { amount: 30000,  currency: "KRW", category: "food",          expense_date: "2026-04-19", description: "로컬 식당" },
  "e3-9": { amount: 70000,  currency: "KRW", category: "shopping",      expense_date: "2026-04-20", description: "광화문 기념품" },
  "e3-10": { amount: 30000, currency: "KRW", category: "food",          expense_date: "2026-04-21", description: "야식" },
  "e3-11": { amount: 20000, currency: "KRW", category: "transport",     expense_date: "2026-04-21", description: "버스" },
  "e3-12": { amount: 30000, currency: "KRW", category: "transport",     expense_date: "2026-04-22", description: "타오위안 공항" },
};

// ── 유틸 ──────────────────────────────────────────────────────────────────────

function formatNumber(raw: string) {
  const digits = raw.replace(/\D/g, "");
  return digits ? Number(digits).toLocaleString("ko-KR") : "";
}

function padNumber(value: number) {
  return String(value).padStart(2, "0");
}

function parseDateValue(value: string) {
  const matched = value.match(/^(\d{4})\.(\d{2})\.(\d{2})$/);
  if (!matched) return null;
  return { year: Number(matched[1]), month: Number(matched[2]), day: Number(matched[3]) };
}

function parseIsoDateValue(value: string | null | undefined) {
  if (!value) return null;
  const matched = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!matched) return null;
  return { year: Number(matched[1]), month: Number(matched[2]), day: Number(matched[3]) };
}

function normalizeDate(value: string) {
  return value.replace(/\./g, "-");
}

const FALLBACK_TRIP_ID = "dummy-trip-1";
const LOCAL_EXPENSES_KEY = "tripy_dummy_expenses";

// ── Suspense 래퍼 ─────────────────────────────────────────────────────────────

export default function ExpensePage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <ExpensePageContent />
    </Suspense>
  );
}

// ── 본문 ─────────────────────────────────────────────────────────────────────

function ExpensePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const expenseId = searchParams.get("expenseId");
  const from = searchParams.get("from") || "/home";
  const isEditMode = !!expenseId;

  const { user, loading: authLoading } = useAuth();
  const { trip: cachedTrip, loading: tripLoading, refresh: refreshTrip } = useTrip();

  const [tab, setTab] = useState<Tab>("expense");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [currency, setCurrency] = useState<Currency | null>(null);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<string>("");
  const [date, setDate] = useState("");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [tripId, setTripId] = useState<string | null>(null);
  const [currentBudget, setCurrentBudget] = useState<number>(0);
  const currencyRef = useRef<HTMLDivElement>(null);
  const keyboardInset = useKeyboardInset();

  // 통화 드롭다운 외부 클릭 닫기
  useEffect(() => {
    if (!currencyOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (currencyRef.current && !currencyRef.current.contains(event.target as Node)) {
        setCurrencyOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setCurrencyOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [currencyOpen]);

  // Auth/Trip 준비 후 tripId·통화 설정
  useEffect(() => {
    if (authLoading || tripLoading) return;
    if (!user) {
      setTripId(FALLBACK_TRIP_ID);
      if (!currency) setCurrency("KRW");
      return;
    }
    if (cachedTrip) {
      setTripId(cachedTrip.id);
      setCurrentBudget(cachedTrip.total_budget ?? 0);
      if (!currency) setCurrency((cachedTrip.currency as Currency) ?? "KRW");
    } else {
      setTripId(FALLBACK_TRIP_ID);
    }
  }, [authLoading, tripLoading, user, cachedTrip]);

  // 수정 모드: expenseId로 데이터 조회 후 폼 채우기
  useEffect(() => {
    if (!expenseId) return;

    // 1. 목업 지출 (즉시)
    const mockExpense = MOCK_EXPENSE_LOOKUP[expenseId];
    if (mockExpense) {
      setAmount(mockExpense.amount.toLocaleString("ko-KR"));
      setCurrency(mockExpense.currency as Currency);
      setCategory(mockExpense.category);
      setPaymentMethod("card");
      setDate(mockExpense.expense_date.replace(/-/g, "."));
      setDescription(mockExpense.description ?? "");
      return;
    }

    // 2. localStorage 지출 (즉시)
    if (expenseId.startsWith("dummy-")) {
      try {
        const stored = JSON.parse(localStorage.getItem(LOCAL_EXPENSES_KEY) ?? "[]") as Array<{
          id: string; amount: number; currency: string; category: string;
          payment_method: string; expense_date: string; description: string | null;
        }>;
        const found = stored.find((e) => e.id === expenseId);
        if (found) {
          setAmount(found.amount.toLocaleString("ko-KR"));
          setCurrency(found.currency as Currency);
          setCategory(found.category);
          setPaymentMethod((found.payment_method as PaymentMethod) ?? "card");
          setDate(found.expense_date.replace(/-/g, "."));
          setDescription(found.description ?? "");
        }
      } catch { /* ignore */ }
      return;
    }

    // 3. Supabase 지출 (비동기, 로그인 후)
    if (authLoading || !user) return;
    supabase
      .from("expenses")
      .select("*")
      .eq("id", expenseId)
      .single()
      .then(({ data, error }) => {
        if (!error && data) {
          setAmount(data.amount.toLocaleString("ko-KR"));
          setCurrency(data.currency as Currency);
          setCategory(data.category);
          setPaymentMethod(data.payment_method ?? "card");
          setDate(data.expense_date.replace(/-/g, "."));
          setDescription(data.description ?? "");
        }
      });
  }, [expenseId, authLoading, user]);

  const rawAmount = amount.replace(/,/g, "");
  const isExpenseValid = !!rawAmount && !!paymentMethod && !!date;
  const isBudgetValid = !!rawAmount && !!date;
  const tripStartDate = parseIsoDateValue(cachedTrip?.start_date);
  const tripEndDate = parseIsoDateValue(cachedTrip?.end_date);

  async function handleSubmit() {
    if (!isEditMode && !tripId) return;
    setSubmitting(true);

    try {
      // ── 수정 모드 ──────────────────────────────────────────────────────────
      if (isEditMode && expenseId) {
        // 목업 지출: 저장 시뮬레이션
        if (MOCK_EXPENSE_LOOKUP[expenseId]) {
          router.replace(from);
          return;
        }

        // localStorage 지출
        if (expenseId.startsWith("dummy-")) {
          const stored = JSON.parse(localStorage.getItem(LOCAL_EXPENSES_KEY) ?? "[]") as Array<Record<string, unknown>>;
          const updated = stored.map((e) =>
            e.id === expenseId
              ? { ...e, amount: Number(rawAmount), currency, category: category || "etc",
                  expense_date: normalizeDate(date), description: description || null }
              : e
          );
          localStorage.setItem(LOCAL_EXPENSES_KEY, JSON.stringify(updated));
          router.replace(from);
          return;
        }

        // Supabase 지출 수정
        const { error } = await supabase
          .from("expenses")
          .update({
            amount: Number(rawAmount),
            currency: currency ?? "KRW",
            category: category || "etc",
            payment_method: paymentMethod,
            expense_date: normalizeDate(date),
            description: description || null,
          })
          .eq("id", expenseId);
        if (error) throw error;
        await refreshTrip();
        router.replace(from);
        return;
      }

      // ── 등록 모드 ──────────────────────────────────────────────────────────
      if (tripId === FALLBACK_TRIP_ID) {
        if (tab === "expense") {
          const newExpense = {
            id: `dummy-${Date.now()}`,
            trip_id: tripId,
            amount: Number(rawAmount),
            currency: currency ?? "KRW",
            category: category || "etc",
            payment_method: paymentMethod,
            expense_date: normalizeDate(date),
            description: description || null,
            created_at: new Date().toISOString(),
          };
          const existing = JSON.parse(localStorage.getItem(LOCAL_EXPENSES_KEY) || "[]");
          localStorage.setItem(LOCAL_EXPENSES_KEY, JSON.stringify([newExpense, ...existing]));
        }
        router.replace("/home?toast=expense");
        return;
      }

      if (tab === "expense") {
        const { error } = await supabase.from("expenses").insert({
          trip_id: tripId,
          amount: Number(rawAmount),
          currency: currency ?? "KRW",
          category: category || "etc",
          payment_method: paymentMethod,
          expense_date: normalizeDate(date),
          description: description || null,
        });
        if (error) throw error;
        await refreshTrip();
      } else {
        const addedAmount = Number(rawAmount);
        const { error } = await supabase
          .from("trips")
          .update({ total_budget: currentBudget + addedAmount })
          .eq("id", tripId);
        if (error) throw error;
        refreshTrip();
      }
      router.replace("/home?toast=expense");
    } catch (err) {
      console.error(err);
      alert("저장에 실패했습니다. 다시 시도해주세요.");
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!expenseId) return;
    setSubmitting(true);
    try {
      // 목업 지출: 삭제 시뮬레이션
      if (MOCK_EXPENSE_LOOKUP[expenseId]) {
        router.replace(from);
        return;
      }

      // localStorage 지출
      if (expenseId.startsWith("dummy-")) {
        const stored = JSON.parse(localStorage.getItem(LOCAL_EXPENSES_KEY) ?? "[]") as Array<Record<string, unknown>>;
        localStorage.setItem(LOCAL_EXPENSES_KEY, JSON.stringify(stored.filter((e) => e.id !== expenseId)));
        router.replace(from);
        return;
      }

      // Supabase 지출 삭제
      const { error } = await supabase.from("expenses").delete().eq("id", expenseId);
      if (error) throw error;
      await refreshTrip();
      router.replace(from);
    } catch (err) {
      console.error(err);
      alert("삭제에 실패했습니다. 다시 시도해주세요.");
      setSubmitting(false);
      setDeleteOpen(false);
    }
  }

  return (
    <div className="relative flex min-h-screen-safe flex-col bg-white">
      <Header
        onBack={() => router.back()}
        title={isEditMode ? "경비 수정" : "경비 등록"}
        onClose={() => router.replace(from)}
      />

      {/* 탭 — 수정 모드에서는 숨김 */}
      {!isEditMode && (
        <div className="mx-auto mt-0 flex w-[343px] gap-[5px] rounded-xl bg-gray-5 p-2">
          <button
            onClick={() => setTab("expense")}
            className={`flex flex-1 items-center justify-center rounded-[10px] py-2 text-body-m font-bold transition-colors ${
              tab === "expense" ? "bg-green-10 text-green-70" : "bg-gray-5 text-gray-60"
            }`}
          >
            지출 추가
          </button>
          <button
            onClick={() => setTab("budget")}
            className={`flex flex-1 items-center justify-center rounded-[10px] py-2 text-body-m font-bold transition-colors ${
              tab === "budget" ? "bg-green-10 text-green-70" : "bg-gray-5 text-gray-60"
            }`}
          >
            예산 추가
          </button>
        </div>
      )}

      {/* 금액 입력 */}
      <div className="mx-auto mt-3 flex w-[343px] items-center justify-between rounded-[15px] bg-gray-5 px-4 py-5">
        <ExchangeDropdown value={currency ?? "KRW"} onChange={setCurrency} />
        <input
          type="text"
          inputMode="numeric"
          value={amount}
          onChange={(e) => setAmount(formatNumber(e.target.value))}
          placeholder="0"
          className="bg-transparent text-right text-title-xl font-bold text-black opacity-90 outline-none placeholder:text-gray-30 w-36"
        />
      </div>

      {/* 폼 */}
      <div className="mx-auto mt-6 flex w-[343px] flex-col gap-6 pb-32">
        {/* 결제 수단 */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1">
            <span className="text-body-l font-bold text-black">결제 수단</span>
            <span className="text-caption-s text-danger-50">*</span>
          </div>
          <div className="flex gap-2">
            {(["card", "cash"] as const).map((method) => (
              <button
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={`flex flex-1 items-center justify-center rounded-[8px] py-2 text-body-m font-bold transition-colors ${
                  paymentMethod === method ? "bg-green-50 text-white" : "bg-gray-20 text-gray-70"
                }`}
              >
                {method === "card" ? "카드" : "현금"}
              </button>
            ))}
          </div>
        </div>

        {/* 카테고리 — 지출 탭 또는 수정 모드 */}
        {(tab === "expense" || isEditMode) && (
          <div className="flex flex-col gap-2">
            <span className="text-body-l font-bold text-black">카테고리</span>
            <div className="flex items-center justify-between">
              {CATEGORIES.map((cat) => (
                <div key={cat.id} className="flex flex-col items-center gap-2">
                  <button
                    onClick={() => setCategory(cat.id)}
                    className={`flex size-12 items-center justify-center rounded-xl transition-all ${
                      category === cat.id
                        ? "border-[2.2px] border-green-50 bg-green-0"
                        : "bg-gray-10"
                    }`}
                  >
                    <CategoryIcon category={cat.id} size={20} />
                  </button>
                  <span
                    className={`text-body-s ${
                      category === cat.id ? "font-bold text-black" : "font-normal text-black"
                    }`}
                  >
                    {cat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 날짜 */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1">
            <span className="text-body-l font-bold text-black">
              {tab === "expense" || isEditMode ? "지출 날짜" : "여행 날짜"}
            </span>
            <span className="text-caption-s text-danger-50">*</span>
          </div>
          <button
            type="button"
            onClick={() => setCalendarOpen(true)}
            className="flex w-full items-center justify-between rounded-xl bg-gray-5 px-3 py-3 text-left"
            aria-label="날짜 선택 열기"
          >
            <span
              className={`text-sm ${date ? "font-medium text-gray-90" : "text-gray-50"}`}
            >
              {date || "날짜"}
            </span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect
                x="1.5" y="2.5" width="13" height="12" rx="2"
                stroke="var(--color-gray-50)" strokeWidth="1.5"
              />
              <path
                d="M5 1V4M11 1V4M1.5 6.5H14.5"
                stroke="var(--color-gray-50)" strokeWidth="1.5" strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* 내용 */}
        <div className="flex flex-col gap-2">
          <span className="text-body-l font-bold text-black">
            {tab === "expense" || isEditMode ? "지출 내용" : "추가 내용"}
          </span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="내용을 입력해 주세요"
            rows={4}
            className="h-[98px] w-full resize-none rounded-xl border border-gray-30 bg-white px-4 py-2 text-base text-gray-90 outline-none placeholder:text-gray-50"
          />
        </div>
      </div>

      {/* 하단 버튼 */}
      <div
        className="fixed bottom-0 left-1/2 w-full -translate-x-1/2 bg-white px-4 pb-4 pt-7 max-w-[390px]"
        style={{ bottom: keyboardInset }}
      >
        {/* 추가하기 / 수정하기 */}
        <button
          onClick={handleSubmit}
          disabled={
            submitting ||
            (tab === "expense" || isEditMode ? !isExpenseValid : !isBudgetValid)
          }
          className="flex h-14 w-full items-center justify-center rounded-xl bg-green-50 text-body-l font-bold text-white opacity-50 disabled:opacity-50 enabled:opacity-100 transition-opacity"
        >
          {isEditMode ? "수정하기" : "추가하기"}
        </button>

        {/* 삭제하기 — 수정 모드에서만 표시 */}
        {isEditMode && (
          <button
            onClick={() => setDeleteOpen(true)}
            disabled={submitting}
            className="mt-3 flex h-14 w-full items-center justify-center rounded-16 border border-danger-50 text-body-l font-bold text-danger-50 disabled:opacity-50"
          >
            삭제하기
          </button>
        )}
      </div>

      {/* 삭제 확인 모달 */}
      <DeleteConfirmModal
        open={deleteOpen}
        onCancel={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
      />

      <CalendarModal
        open={calendarOpen}
        onClose={() => setCalendarOpen(false)}
        singleDate={true}
        initialDeparture={parseDateValue(date)}
        initialArrival={null}
        minDate={tripStartDate}
        maxDate={tripEndDate}
        onSelect={(departure) => {
          const formattedDate = `${departure.year}.${padNumber(departure.month)}.${padNumber(departure.day)}`;
          setDate(formattedDate);
          setCalendarOpen(false);
        }}
      />
    </div>
  );
}
