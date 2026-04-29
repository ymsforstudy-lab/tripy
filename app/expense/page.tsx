"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import CalendarModal from "@/components/ui/CalendarModal";
import { supabase } from "@/lib/supabase";
import { CURRENCIES, CURRENCY_UNIT, type Currency } from "@/lib/constants/currency";
import { CATEGORIES } from "@/lib/constants/categories";
import CategoryIcon from "@/components/ui/CategoryIcon";

type Tab = "expense" | "budget";
type PaymentMethod = "card" | "cash";


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

  return {
    year: Number(matched[1]),
    month: Number(matched[2]),
    day: Number(matched[3]),
  };
}

function normalizeDate(value: string) {
  return value.replace(/\./g, "-");
}

const FALLBACK_TRIP_ID = "dummy-trip-1";
const LOCAL_EXPENSES_KEY = "tripy_dummy_expenses";

export default function ExpensePage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("expense");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [currency, setCurrency] = useState<Currency>("KRW");
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [hoveredCurrency, setHoveredCurrency] = useState<Currency | null>(null);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<string>("");
  const [date, setDate] = useState("");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [tripId, setTripId] = useState<string | null>(null);
  const [currentBudget, setCurrentBudget] = useState<number>(0);
  const currencyRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    async function fetchTrip() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setTripId(FALLBACK_TRIP_ID);
        return;
      }

      const { data } = await supabase
        .from("trips")
        .select("id, total_budget")
        .eq("user_id", user.id)
        .eq("is_archived", false)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (data) {
        setTripId(data.id);
        setCurrentBudget(data.total_budget ?? 0);
      } else {
        setTripId(FALLBACK_TRIP_ID);
      }
    }
    fetchTrip();
  }, []);

  const rawAmount = amount.replace(/,/g, "");
  const isExpenseValid =
    !!rawAmount && !!paymentMethod && !!date;
  const isBudgetValid = !!rawAmount && !!date;

  async function handleSubmit() {
    if (!tripId) return;
    setSubmitting(true);

    try {
      if (tripId === FALLBACK_TRIP_ID) {
        if (tab === "expense") {
          const newExpense = {
            id: `dummy-${Date.now()}`,
            trip_id: tripId,
            amount: Number(rawAmount),
            currency,
            category: category || "etc",
            expense_date: normalizeDate(date),
            description: description || null,
            created_at: new Date().toISOString(),
          };
          const existing = JSON.parse(
            localStorage.getItem(LOCAL_EXPENSES_KEY) || "[]"
          );
          localStorage.setItem(
            LOCAL_EXPENSES_KEY,
            JSON.stringify([newExpense, ...existing])
          );
        }
        router.push("/home");
        return;
      }

      if (tab === "expense") {
        const { error } = await supabase.from("expenses").insert({
          trip_id: tripId,
          amount: Number(rawAmount),
          currency,
          category: category || "etc",
          expense_date: date,
          description: description || null,
        });
        if (error) throw error;
      } else {
        const addedAmount = Number(rawAmount);
        const { error } = await supabase
          .from("trips")
          .update({ total_budget: currentBudget + addedAmount })
          .eq("id", tripId);
        if (error) throw error;
      }
      router.push("/home");
    } catch (err) {
      console.error(err);
      alert("저장에 실패했습니다. 다시 시도해주세요.");
      setSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-white">
      <Header
        onBack={() => router.back()}
        title="경비 등록"
        onClose={() => router.push("/home")}
      />

      {/* 탭 */}
      <div className="mx-auto mt-0 flex w-[343px] gap-[5px] rounded-xl bg-gray-5 p-2">
        <button
          onClick={() => setTab("expense")}
          className={`flex flex-1 items-center justify-center rounded-[10px] py-2 text-[14px] font-bold transition-colors ${
            tab === "expense"
              ? "bg-green-10 text-green-70"
              : "bg-gray-5 text-gray-60"
          }`}
        >
          지출 추가
        </button>
        <button
          onClick={() => setTab("budget")}
          className={`flex flex-1 items-center justify-center rounded-[10px] py-2 text-[14px] font-bold transition-colors ${
            tab === "budget"
              ? "bg-green-10 text-green-70"
              : "bg-gray-5 text-gray-60"
          }`}
        >
          예산 추가
        </button>
      </div>

      {/* 금액 입력 */}
      <div className="mx-auto mt-3 flex w-[343px] items-center justify-between rounded-[15px] bg-gray-5 px-4 py-5">
        {/* 통화 선택 */}
        <div className="relative" ref={currencyRef}>
          <button
            onClick={() => setCurrencyOpen(!currencyOpen)}
            className="flex items-center gap-2 rounded-xl bg-white px-2.5 py-2"
          >
            <span className="text-[12px] font-bold text-gray-90">
              {currency}({CURRENCY_UNIT[currency]})
            </span>
            <svg
              width="20" height="20" viewBox="0 0 20 20" fill="none"
              className={`transition-transform ${currencyOpen ? "-rotate-90" : "rotate-90"}`}
            >
              <path d="M7 5L12 10L7 15" stroke="#1D1D1D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {currencyOpen && (
            <div
              className="absolute left-0 top-[44px] z-20 w-40 overflow-hidden rounded-xl border border-gray-30 bg-white shadow-md"
              onMouseLeave={() => setHoveredCurrency(null)}
            >
              {CURRENCIES.map((c) => {
                const isActive = hoveredCurrency ? c === hoveredCurrency : c === currency;
                return (
                  <button
                    key={c}
                    onClick={() => { setCurrency(c); setCurrencyOpen(false); setHoveredCurrency(null); }}
                    onMouseEnter={() => setHoveredCurrency(c)}
                    className={`flex w-full items-center px-4 py-2 text-sm text-gray-90 transition-colors ${
                      isActive ? "bg-gray-5 font-medium" : ""
                    }`}
                  >
                    {c}({CURRENCY_UNIT[c]})
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 금액 */}
        <input
          type="text"
          inputMode="numeric"
          value={amount}
          onChange={(e) => setAmount(formatNumber(e.target.value))}
          placeholder="0"
          className="bg-transparent text-right text-[24px] font-bold text-black opacity-90 outline-none placeholder:text-gray-30 w-36"
        />
      </div>

      {/* 폼 내용 */}
      <div className="mx-auto mt-6 flex w-[343px] flex-col gap-6 pb-32">
        {/* 지출 추가 전용 필드 */}
        {tab === "expense" && (
          <>
          {/* 결제 수단 */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1">
              <span className="text-[16px] font-bold text-black">결제 수단</span>
              <span className="text-[10px] text-danger-50">*</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPaymentMethod("card")}
                className={`flex flex-1 items-center justify-center rounded-[8px] py-2 text-[14px] font-bold transition-colors ${
                  paymentMethod === "card"
                    ? "bg-green-50 text-white"
                    : "bg-gray-20 text-gray-70"
                }`}
              >
                카드
              </button>
              <button
                onClick={() => setPaymentMethod("cash")}
                className={`flex flex-1 items-center justify-center rounded-[8px] py-2 text-[14px] font-bold transition-colors ${
                  paymentMethod === "cash"
                    ? "bg-green-50 text-white"
                    : "bg-gray-20 text-gray-70"
                }`}
              >
                현금
              </button>
            </div>
          </div>

          {/* 카테고리 */}
          <div className="flex flex-col gap-2">
            <span className="text-[16px] font-bold text-black">카테고리</span>
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
                  <span className={`text-[12px] ${category === cat.id ? "font-bold text-black" : "font-normal text-black"}`}>
                    {cat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
          </>
        )}

        {/* 날짜 */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1">
            <span className="text-[16px] font-bold text-black">
              {tab === "expense" ? "지출 날짜" : "여행 날짜"}
            </span>
            <span className="text-[10px] text-danger-50">*</span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-gray-30 bg-white px-4 py-2.5 w-full">
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="yyyy.mm.dd"
              className="flex-1 bg-transparent text-[14px] text-gray-50 outline-none placeholder:text-gray-50"
            />
            <button onClick={() => setCalendarOpen(true)} aria-label="날짜 선택 열기">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="2" y="4" width="16" height="14" rx="2" stroke="#2D2D2D" strokeWidth="1.4" />
                <path d="M2 8H18" stroke="#2D2D2D" strokeWidth="1.4" />
                <path d="M6 2V5M14 2V5" stroke="#2D2D2D" strokeWidth="1.4" strokeLinecap="round" />
                <circle cx="6.5" cy="12" r="1" fill="#2D2D2D" />
                <circle cx="10" cy="12" r="1" fill="#2D2D2D" />
                <circle cx="13.5" cy="12" r="1" fill="#2D2D2D" />
              </svg>
            </button>
          </div>
        </div>

        {/* 내용 */}
        <div className="flex flex-col gap-2">
          <span className="text-[16px] font-bold text-black">
            {tab === "expense" ? "지출 내용" : "추가 내용"}
          </span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="내용을 입력해 주세요"
            rows={4}
            className="h-[98px] w-full resize-none rounded-xl border border-gray-30 bg-white px-4 py-2 text-[14px] text-gray-90 outline-none placeholder:text-gray-50"
          />
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="fixed bottom-0 left-1/2 w-full max-w-[390px] -translate-x-1/2 bg-white px-4 pb-4 pt-7">
        <button
          onClick={handleSubmit}
          disabled={tab === "expense" ? !isExpenseValid || submitting : !isBudgetValid || submitting}
          className="flex h-14 w-full items-center justify-center rounded-xl bg-green-50 text-[16px] font-bold text-white opacity-50 disabled:opacity-50 enabled:opacity-100 transition-opacity"
        >
          추가하기
        </button>
      </div>

      <CalendarModal
        open={calendarOpen}
        onClose={() => setCalendarOpen(false)}
        singleDate={true}
        initialDeparture={parseDateValue(date)}
        initialArrival={null}
        onSelect={(departure) => {
          const formattedDate = `${departure.year}.${padNumber(departure.month)}.${padNumber(departure.day)}`;
          setDate(formattedDate);
          setCalendarOpen(false);
        }}
      />
    </div>
  );
}
