"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/layout/Header";
import BottomCTA from "@/components/ui/BottomCTA";
import CalendarModal from "@/components/ui/CalendarModal";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useTrip } from "@/contexts/TripContext";

interface DateValue {
  year: number;
  month: number;
  day: number;
}

type Step = "input" | "confirm";

const CalendarIcon = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="1.5" y="2.5" width="13" height="12" rx="2" stroke="#8E8E8E" strokeWidth="1.5" />
    <path d="M5 1V4M11 1V4M1.5 6.5H14.5" stroke="#8E8E8E" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const SearchIcon = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="7" cy="7" r="5.5" stroke="#8E8E8E" strokeWidth="1.5" />
    <path d="M11 11L14 14" stroke="#8E8E8E" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

function formatDate(d: DateValue) {
  return `${d.year}년 ${d.month}월 ${d.day}일`;
}

function toISODate(d: DateValue) {
  const mm = String(d.month).padStart(2, "0");
  const dd = String(d.day).padStart(2, "0");
  return `${d.year}-${mm}-${dd}`;
}

function calcNights(start: DateValue, end: DateValue) {
  const s = new Date(start.year, start.month - 1, start.day);
  const e = new Date(end.year, end.month - 1, end.day);
  const diff = Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}

function DateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { refresh } = useTrip();
  const country = searchParams.get("country") ?? "";
  const region = searchParams.get("region");

  const [step, setStep] = useState<Step>("input");
  const [departure, setDeparture] = useState<DateValue | null>(null);
  const [arrival, setArrival] = useState<DateValue | null>(null);
  const [isDayTrip, setIsDayTrip] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const destinationLabel = region ? `${country} ${region}` : country;

  const handleBack = () => {
    if (step === "confirm") setStep("input");
    else router.back();
  };

  const handleNext = async () => {
    if (step === "input") {
      setStep("confirm");
      return;
    }

    // confirm 단계 → Supabase에 trip INSERT
    if (!departure) return;

    if (!user) {
      alert("로그인이 필요합니다. 다시 로그인해주세요.");
      router.push("/");
      return;
    }
    setSaving(true);

    const startDate = toISODate(departure);
    const endDate = isDayTrip || !arrival ? startDate : toISODate(arrival);

    const { error } = await supabase.from("trips").insert({
      user_id: user.id,
      title: `${country} 여행`,
      destination: region ?? null,
      start_date: startDate,
      end_date: endDate,
      total_budget: 0,
      currency: "KRW",
      is_archived: false,
    });

    if (error) {
      console.error("Trip 생성 실패:", error);
      alert("여행 등록에 실패했습니다. 다시 시도해주세요.");
      setSaving(false);
      return;
    }

    await refresh();
    router.push("/setup/confirm");
  };

  const isNextEnabled = !saving && (isDayTrip || departure !== null);

  const nightsLabel = () => {
    if (!departure) return null;
    if (isDayTrip || !arrival) return "당일치기";
    const nights = calcNights(departure, arrival);
    if (nights === 0) return "당일치기";
    return `${nights}박${nights + 1}일`;
  };

  return (
    <div className="relative flex h-screen flex-col bg-white">
      <Header onBack={handleBack} />

      <div className="px-4 pt-5">
        <h1 className="text-2xl font-bold leading-[1.5] tracking-[-0.48px] text-gray-90">
          {step === "confirm"
            ? <>여행지 정보를<br />확인해주세요!</>
            : <>여행 일정을<br />등록해주세요</>}
        </h1>
      </div>

      <div className="mt-10 flex flex-col gap-6 px-4">
        {/* confirm 단계: 여행지 섹션 */}
        {step === "confirm" && (
          <div className="flex flex-col gap-2">
            <span className="text-base font-bold tracking-[-0.32px] text-gray-90">여행지</span>
            <div className="flex items-center gap-3 rounded-xl bg-gray-5 px-3 py-3">
              <span className="flex-1 text-sm font-medium text-gray-90">{destinationLabel}</span>
              {SearchIcon}
            </div>
          </div>
        )}

        {/* 여행 일정 섹션 */}
        <div className="flex flex-col gap-3">
          {step === "confirm" && (
            <span className="text-base font-bold tracking-[-0.32px] text-gray-90">여행 일정</span>
          )}

          {/* 날짜 입력 버튼 */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCalendarOpen(true)}
              className="flex flex-1 items-center justify-between rounded-xl bg-gray-5 px-3 py-3"
            >
              <span className={`text-sm ${departure ? "font-medium text-gray-90" : "text-gray-50"}`}>
                {departure ? formatDate(departure) : "출발일"}
              </span>
              {CalendarIcon}
            </button>

            <span className="text-sm text-gray-50">~</span>

            <button
              onClick={() => setCalendarOpen(true)}
              disabled={isDayTrip}
              className="flex flex-1 items-center justify-between rounded-xl bg-gray-5 px-3 py-3 disabled:opacity-40"
            >
              <span className={`text-sm ${arrival && !isDayTrip ? "font-medium text-gray-90" : "text-gray-50"}`}>
                {isDayTrip ? "당일치기" : arrival ? formatDate(arrival) : "도착일"}
              </span>
              {!isDayTrip && CalendarIcon}
            </button>
          </div>

          {/* 박/일 표시 */}
          {departure && (
            <div className="flex justify-end">
              <span className="text-xs font-bold text-green-60">{nightsLabel()}</span>
            </div>
          )}

          {/* 당일치기 체크박스 */}
          <button
            onClick={() => {
              setIsDayTrip(!isDayTrip);
              if (!isDayTrip) setArrival(null);
            }}
            className="flex items-center gap-2"
          >
            <div
              className={`flex size-5 items-center justify-center rounded-full border-2 ${
                isDayTrip ? "border-green-40 bg-green-40" : "border-gray-30 bg-white"
              }`}
            >
              {isDayTrip && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span className="text-sm text-gray-60">당일치기에요</span>
          </button>
        </div>
      </div>

      {/* confirm 단계: 안내 배너 */}
      {step === "confirm" && (
        <div className="mx-4 mt-4 flex items-center gap-2 rounded-lg bg-info-5 px-4 py-3">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="#2768FF" strokeWidth="1.5" />
            <path d="M8 7V11M8 5V5.5" stroke="#2768FF" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="text-xs tracking-[-0.24px] text-info-50">
            여행 일정은 나중에 변경할 수 있어요!
          </span>
        </div>
      )}

      <div className="mt-auto">
        <BottomCTA
          label={saving ? "등록 중..." : "다음"}
          onClick={handleNext}
          disabled={!isNextEnabled}
        />
      </div>

      {/* 캘린더 모달 */}
      <CalendarModal
        open={calendarOpen}
        onClose={() => setCalendarOpen(false)}
        onSelect={(dep, arr) => {
          setDeparture(dep);
          setArrival(arr);
        }}
        initialDeparture={departure}
        initialArrival={arrival}
      />
    </div>
  );
}

export default function DatePage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><span className="text-sm text-gray-50">로딩 중...</span></div>}>
      <DateContent />
    </Suspense>
  );
}
