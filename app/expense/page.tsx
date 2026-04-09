"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import { supabase } from "@/lib/supabase";

type Tab = "expense" | "budget";
type PaymentMethod = "card" | "cash";

const CURRENCIES = ["KRW", "USD", "JPY", "EUR"] as const;
type Currency = (typeof CURRENCIES)[number];

const CURRENCY_COUNTRY: Record<Currency, string> = {
  KRW: "대한민국",
  USD: "미국",
  JPY: "일본",
  EUR: "유럽",
};

const CATEGORIES = [
  { id: "accommodation", label: "숙소", emoji: "🏠" },
  { id: "food", label: "식비", emoji: "🍴" },
  { id: "transport", label: "교통", emoji: "🚌" },
  { id: "activity", label: "액티비티", emoji: "🎿" },
  { id: "shopping", label: "쇼핑", emoji: "🛍️" },
  { id: "etc", label: "기타", emoji: "➕" },
] as const;

function formatNumber(raw: string) {
  const digits = raw.replace(/\D/g, "");
  return digits ? Number(digits).toLocaleString("ko-KR") : "";
}

export default function ExpensePage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("expense");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [currency, setCurrency] = useState<Currency>("KRW");
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<string>("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [tripId, setTripId] = useState<string | null>(null);
  const [currentBudget, setCurrentBudget] = useState<number>(0);

  useEffect(() => {
    async function fetchTrip() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

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
      }
    }
    fetchTrip();
  }, []);

  const rawAmount = amount.replace(/,/g, "");
  const isExpenseValid =
    !!rawAmount && !!paymentMethod && !!date;
  const isBudgetValid = !!rawAmount && !!paymentMethod && !!date;

  async function handleSubmit() {
    if (!tripId) return;
    setSubmitting(true);

    try {
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
      <div className="mx-auto mt-3 flex w-[343px] items-center justify-between overflow-hidden rounded-[15px] bg-gray-5 px-4 py-5">
        {/* 통화 선택 */}
        <div className="relative">
          <button
            onClick={() => setCurrencyOpen(!currencyOpen)}
            className="flex items-center gap-2 rounded-xl bg-white px-2.5 py-2"
          >
            <span className="text-[12px] font-bold text-gray-90">
              {currency}({CURRENCY_COUNTRY[currency]})
            </span>
            <svg
              width="20" height="20" viewBox="0 0 20 20" fill="none"
              className="rotate-90"
            >
              <path d="M7 5L12 10L7 15" stroke="#1D1D1D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {currencyOpen && (
            <div className="absolute left-0 top-[44px] z-20 w-40 overflow-hidden rounded-xl border border-gray-30 bg-white shadow-md">
              {CURRENCIES.map((c) => (
                <button
                  key={c}
                  onClick={() => { setCurrency(c); setCurrencyOpen(false); }}
                  className={`flex w-full items-center px-4 py-2 text-sm ${
                    c === currency ? "bg-gray-5 font-medium text-gray-90" : "text-gray-90"
                  }`}
                >
                  {c}({CURRENCY_COUNTRY[c]})
                </button>
              ))}
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

        {/* 지출 추가 전용 필드 */}
        {tab === "expense" && (
          <div className="flex flex-col gap-2">
            <span className="text-[16px] font-bold text-black">카테고리</span>
            <div className="flex items-center justify-between">
              {CATEGORIES.map((cat) => (
                <div key={cat.id} className="flex flex-col items-center gap-2">
                  <button
                    onClick={() => setCategory(cat.id)}
                    className={`flex size-12 items-center justify-center rounded-xl text-[22px] transition-all ${
                      category === cat.id
                        ? "border-[2.2px] border-green-50 bg-green-0"
                        : "bg-gray-10"
                    }`}
                  >
                    {cat.emoji}
                  </button>
                  <span className={`text-[12px] ${category === cat.id ? "font-bold text-black" : "font-normal text-black"}`}>
                    {cat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 날짜 */}
        <div className={`flex ${tab === "budget" ? "items-center gap-4" : "flex-col gap-2"}`}>
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-[16px] font-bold text-black">
              {tab === "expense" ? "지출 날짜" : "여행 날짜"}
            </span>
            <span className="text-[10px] text-danger-50">*</span>
          </div>
          <div className={`flex items-center justify-between rounded-xl border border-gray-30 bg-white px-4 py-2.5 ${tab === "budget" ? "flex-1" : "w-full"}`}>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="yyyy.mm.dd"
              className="flex-1 bg-transparent text-[14px] text-gray-50 outline-none placeholder:text-gray-50"
            />
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="2" y="4" width="16" height="14" rx="2" stroke="#2D2D2D" strokeWidth="1.4" />
              <path d="M2 8H18" stroke="#2D2D2D" strokeWidth="1.4" />
              <path d="M6 2V5M14 2V5" stroke="#2D2D2D" strokeWidth="1.4" strokeLinecap="round" />
              <circle cx="6.5" cy="12" r="1" fill="#2D2D2D" />
              <circle cx="10" cy="12" r="1" fill="#2D2D2D" />
              <circle cx="13.5" cy="12" r="1" fill="#2D2D2D" />
            </svg>
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
    </div>
  );
}
