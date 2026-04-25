"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { supabase } from "@/lib/supabase";
import { CURRENCIES, CURRENCY_UNIT, type Currency } from "@/lib/constants/currency";

function formatNumber(raw: string) {
  const digits = raw.replace(/\D/g, "");
  return digits ? Number(digits).toLocaleString("ko-KR") : "";
}

type TripInfo = {
  id: string;
  title: string;
  destination: string | null;
  start_date: string;
  end_date: string;
  currency: string;
};

function calcNights(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const nights = Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
  return `${nights}박${nights + 1}일`;
}

export default function BudgetPage() {
  const router = useRouter();
  const [currency, setCurrency] = useState<Currency>("KRW");
  const [amount, setAmount] = useState("");
  const [includeReserve, setIncludeReserve] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [tripInfo, setTripInfo] = useState<TripInfo | null>(null);
  const [saving, setSaving] = useState(false);

  const unit = CURRENCY_UNIT[currency];

  useEffect(() => {
    async function fetchTrip() {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      console.log("[budget] user:", user, "authError:", authError);
      if (!user) return;

      const { data, error } = await supabase
        .from("trips")
        .select("id, title, destination, start_date, end_date, currency")
        .eq("user_id", user.id)
        .eq("is_archived", false)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
      console.log("[budget] trip data:", data, "error:", error);

      if (data) {
        setTripInfo(data);
        if (data.currency) setCurrency(data.currency as Currency);
      }
    }
    fetchTrip();
  }, []);

  async function handleRegister() {
    if (!tripInfo) return;
    setSaving(true);

    const rawAmount = Number(amount.replace(/,/g, ""));
    try {
      const { error } = await supabase
        .from("trips")
        .update({
          total_budget: rawAmount,
          currency,
        })
        .eq("id", tripInfo.id);

      if (error) throw error;
      router.push("/home");
    } catch (err) {
      console.error(err);
      alert("예산 등록에 실패했습니다. 다시 시도해주세요.");
      setSaving(false);
    }
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(formatNumber(e.target.value));
  };

  return (
    <div className="relative flex h-screen flex-col bg-white">
      <Header onBack={() => router.back()} />

      <div className="px-4 pt-5">
        <h1 className="text-2xl font-bold leading-[1.5] tracking-[-0.48px] text-gray-90">
          여행예산을<br />정해볼까요?
        </h1>
      </div>

      <div className="mt-6 flex flex-col gap-5 px-4">
        {/* 여행정보 섹션 */}
        <div className="flex flex-col gap-3">
          <span className="text-base font-bold tracking-[-0.32px] text-gray-90">여행정보</span>
          <div className="flex flex-col gap-4 rounded-xl bg-green-0 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-green-60">여행</span>
              <span className="text-sm text-gray-90 opacity-80">
                {tripInfo?.title ?? "불러오는 중..."}
              </span>
            </div>
            {tripInfo?.destination && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-60">목적지</span>
                <span className="text-sm text-gray-90 opacity-80">{tripInfo.destination}</span>
              </div>
            )}
            <div className="flex items-start justify-between">
              <span className="text-sm font-medium text-green-60">일정</span>
              <div className="flex flex-col items-end">
                <span className="text-sm text-gray-90 opacity-80">
                  {tripInfo
                    ? `${tripInfo.start_date.replace(/-/g, ".")} - ${tripInfo.end_date.replace(/-/g, ".")}`
                    : "불러오는 중..."}
                </span>
                {tripInfo && (
                  <span className="text-sm font-bold text-gray-90">
                    {calcNights(tripInfo.start_date, tripInfo.end_date)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 여행예산 섹션 */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-base font-bold tracking-[-0.32px] text-gray-90">여행예산</span>
            {amount && (
              <span className="text-sm text-gray-90">
                {amount} <span className="font-bold">{unit}</span>
              </span>
            )}
          </div>

          {/* 통화 + 금액 입력 */}
          <div className="flex gap-2">
            {/* 통화 드롭다운 */}
            <div className="relative">
              <button
                onClick={() => setCurrencyOpen(!currencyOpen)}
                className="flex h-12 w-24 items-center justify-between rounded-xl border border-gray-30 px-4"
              >
                <span className="text-sm font-medium text-gray-90">{currency}</span>
                <svg
                  width="16" height="16" viewBox="0 0 16 16" fill="none"
                  className={`transition-transform ${currencyOpen ? "rotate-180" : ""}`}
                >
                  <path d="M4 6L8 10L12 6" stroke="#1D1D1D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {currencyOpen && (
                <div className="absolute left-0 top-[52px] z-10 w-24 overflow-hidden rounded-xl border border-gray-30 bg-white shadow-md">
                  {CURRENCIES.map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setCurrency(c);
                        setCurrencyOpen(false);
                      }}
                      className={`flex w-full items-center px-4 py-2 text-sm ${
                        c === currency ? "bg-gray-5 font-medium text-gray-90" : "font-normal text-gray-90"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 금액 입력 */}
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-gray-30 px-4 py-3">
              <input
                type="text"
                inputMode="numeric"
                value={amount}
                onChange={handleAmountChange}
                placeholder="금액 입력"
                className="flex-1 bg-transparent text-sm text-gray-90 outline-none placeholder:text-gray-50"
              />
              {amount && (
                <span className="shrink-0 text-sm font-bold text-gray-90">{unit}</span>
              )}
              {amount && (
                <button onClick={() => setAmount("")} className="shrink-0">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="8" fill="#C6C6C6" />
                    <path d="M5 5L11 11M11 5L5 11" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* 비상금 체크박스 */}
          <button
            onClick={() => setIncludeReserve(!includeReserve)}
            className="flex items-center gap-2"
          >
            <div
              className={`flex size-5 items-center justify-center rounded-full border-2 ${
                includeReserve ? "border-green-40 bg-green-40" : "border-gray-30 bg-white"
              }`}
            >
              {includeReserve && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span className="text-sm tracking-[-0.28px] text-gray-90">비상금 포함</span>
          </button>
        </div>
      </div>

      {/* 안내 배너 */}
      <div className="mx-4 mt-4 flex items-center gap-2 rounded-lg bg-info-5 px-4 py-3">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" stroke="#2768FF" strokeWidth="1.5" />
          <path d="M8 7V11M8 5V5.5" stroke="#2768FF" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span className="text-xs tracking-[-0.24px] text-info-50">
          비상금은 여행예산의 10% 정도로 책정하는게 좋아요
        </span>
      </div>

      {/* 하단 버튼 */}
      <div className="mt-auto border-t border-gray-20 bg-white px-4 pb-8 pt-4">
        <Button
          label="다음"
          onClick={() => setShowModal(true)}
          disabled={!amount}
        />
        <Button
          label="나중에 할게요"
          variant="ghost"
          onClick={() => router.push("/home")}
        />
      </div>

      {/* 확인 모달 */}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <div className="rounded-t-2xl bg-white px-4 pb-10 pt-6">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-xl font-bold tracking-[-0.4px] text-gray-90">
                예산을 등록하시겠습니까?
              </span>
              <button onClick={() => setShowModal(false)}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 4L16 16M16 4L4 16" stroke="#1D1D1D" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="mb-6 rounded-xl bg-gray-5 p-4">
              <span className="text-sm text-gray-90">여행 예산</span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-sm text-gray-90">{currency} {amount}</span>
                <span className="text-sm font-bold text-gray-90">{unit}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                label="취소하기"
                variant="secondary"
                fullWidth
                onClick={() => setShowModal(false)}
              />
              <Button
                label={saving ? "등록 중..." : "등록하기"}
                variant="primary"
                fullWidth
                onClick={handleRegister}
              />
            </div>
          </div>
      </Modal>
    </div>
  );
}
