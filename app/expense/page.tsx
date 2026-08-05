"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/ui/Header";
import CalendarModal from "@/components/ui/CalendarModal";
import ExchangeDropdown from "@/components/ui/ExchangeDropdown";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useTrip } from "@/contexts/TripContext";
import { CURRENCIES, CURRENCY_UNIT, type Currency } from "@/lib/constants/currency";
import CategoryIcon from "@/components/ui/CategoryIcon";

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

function parseIsoDateValue(value: string | null | undefined) {
  if (!value) return null;
  const matched = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
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
  const { user, loading: authLoading } = useAuth();
  const { trip: cachedTrip, loading: tripLoading, refresh: refreshTrip } = useTrip();
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
    if (authLoading || tripLoading) return;

    if (!user) {
      setTripId(FALLBACK_TRIP_ID);
      return;
    }

    if (cachedTrip) {
      setTripId(cachedTrip.id);
      setCurrentBudget(cachedTrip.total_budget ?? 0);
    } else {
      setTripId(FALLBACK_TRIP_ID);
    }
  }, [authLoading, tripLoading, user, cachedTrip]);

  const rawAmount = amount.replace(/,/g, "");
  const isExpenseValid =
    !!rawAmount && !!paymentMethod && !!date;
  const isBudgetValid = !!rawAmount && !!date;
  const tripStartDate = parseIsoDateValue(cachedTrip?.start_date);
  const tripEndDate = parseIsoDateValue(cachedTrip?.end_date);

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
        router.push("/home?toast=expense");
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
        refreshTrip();
      }
      router.push("/home?toast=expense");
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
        <ExchangeDropdown value={currency} onChange={setCurrency} />

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
          <button
            type="button"
            onClick={() => setCalendarOpen(true)}
            className="flex w-full items-center justify-between rounded-xl bg-gray-5 px-3 py-3 text-left"
            aria-label="날짜 선택 열기"
          >
            <span
              className={`text-sm ${
                date ? "font-medium text-gray-90" : "text-gray-50"
              }`}
            >
              {date || "날짜"}
            </span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect
                x="1.5"
                y="2.5"
                width="13"
                height="12"
                rx="2"
                stroke="#8E8E8E"
                strokeWidth="1.5"
              />
              <path
                d="M5 1V4M11 1V4M1.5 6.5H14.5"
                stroke="#8E8E8E"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
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
      <div className="fixed bottom-0 left-1/2 w-full -translate-x-1/2 bg-white px-4 pb-4 pt-7 sm:max-w-[390px]">
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
