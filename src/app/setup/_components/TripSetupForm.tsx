"use client";

import { useState } from "react";
import Image from "next/image";
import CalendarModal from "@/components/ui/CalendarModal";
import { COUNTRIES } from "@/lib/constants/countries";
import { CURRENCIES, getCurrencyUnit, type Currency } from "@/lib/constants/currency";
import {
  formatBudgetSummary,
  formatDotDate,
  formatNights,
  type DateValue,
  type TripFormValue,
} from "../_lib/tripForm";

interface TripSetupFormProps {
  value: TripFormValue;
  onChange: (next: TripFormValue) => void;
}

const LABEL = "text-body-l font-semibold text-text-primary";
const SUMMARY = "text-body-m font-bold text-text-primary";
const FIELD_BOX = "flex h-12 items-center justify-between rounded-12 bg-surface-subtle p-3";

export default function TripSetupForm({ value, onChange }: TripSetupFormProps) {
  const set = (patch: Partial<TripFormValue>) => onChange({ ...value, ...patch });
  const nights = formatNights(value);
  const budget = formatBudgetSummary(value);

  return (
    <div className="flex flex-col">
      <section className="flex flex-col gap-3 px-5">
        <h2 className={LABEL}>여행지</h2>
        <DestinationInput value={value.destination} onChange={(destination) => set({ destination })} />
      </section>

      <section className="mt-6 flex flex-col gap-3 px-5">
        <div className="flex items-center justify-between">
          <h2 className={LABEL}>기간</h2>
          {nights && <span className={SUMMARY}>{nights}</span>}
        </div>
        <PeriodInput value={value} onChange={set} />
      </section>

      <section className="mt-8 flex flex-col gap-3 px-4">
        <div className="flex items-end justify-between">
          <h2 className={LABEL}>예산</h2>
          {budget && (
            <span className={`flex gap-1 ${SUMMARY}`}>
              <span>{budget.amount}</span>
              <span>{budget.unit}</span>
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <CurrencySelect value={value.currency} onChange={(currency) => set({ currency })} />
          <AmountInput
            value={value.amount}
            unit={value.currency ? getCurrencyUnit(value.currency) : null}
            onChange={(amount) => set({ amount })}
          />
        </div>
      </section>
    </div>
  );
}

function DestinationInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [focused, setFocused] = useState(false);
  const query = value.trim();
  const suggestions = query ? COUNTRIES.filter((c) => c.name.includes(query) && c.name !== query) : [];

  return (
    <div className="relative">
      <label className={FIELD_BOX}>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="국가를 입력해 주세요"
          aria-label="여행지"
          className="min-w-0 flex-1 bg-transparent text-body-m text-text-strong outline-none placeholder:text-text-muted"
        />
        <span className="flex size-6 shrink-0 items-center justify-center">
          <Image src="/icons/setup/search.svg" alt="" width={17} height={17} unoptimized />
        </span>
      </label>

      {/* 국가 추천 목록 (Figma 미반영) */}
      {focused && suggestions.length > 0 && (
        <ul className="absolute inset-x-0 top-full z-20 mt-1 max-h-60 overflow-y-auto rounded-12 border border-border-subtle bg-surface-default py-1 shadow-raised">
          {suggestions.map((c) => (
            <li key={c.name}>
              <button
                type="button"
                // blur보다 먼저 선택되도록 mousedown에서 처리
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(c.name);
                  setFocused(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-body-m text-text-primary"
              >
                <span>{c.emoji}</span>
                {c.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function DateBox({ label, date, onClick, disabled }: { label: string; date: DateValue | null; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`min-w-0 flex-1 ${FIELD_BOX} disabled:opacity-50`}
    >
      <span className={`text-body-m ${date ? "text-text-primary" : "text-text-muted"}`}>
        {date ? formatDotDate(date) : label}
      </span>
      <Image src="/icons/setup/calendar.svg" alt="" width={24} height={24} unoptimized />
    </button>
  );
}

function PeriodInput({ value, onChange }: { value: TripFormValue; onChange: (patch: Partial<TripFormValue>) => void }) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  // 열 때마다 현재 값으로 달력을 다시 그린다 (CalendarModal은 첫 마운트 때만 초기값을 읽는다)
  const [calendarKey, setCalendarKey] = useState(0);
  const openCalendar = () => {
    setCalendarKey((k) => k + 1);
    setCalendarOpen(true);
  };

  return (
    <>
      <div className="flex items-center gap-1">
        <DateBox label="출발일" date={value.departure} onClick={openCalendar} />
        <span className="flex size-4 shrink-0 items-center justify-center text-body-s text-text-strong">~</span>
        <DateBox
          label="도착일"
          date={value.isDayTrip ? value.departure : value.arrival}
          onClick={openCalendar}
          disabled={value.isDayTrip}
        />
      </div>

      <button
        type="button"
        role="checkbox"
        aria-checked={value.isDayTrip}
        onClick={() => onChange({ isDayTrip: !value.isDayTrip, arrival: null })}
        className="flex items-center gap-1 self-start"
      >
        {value.isDayTrip ? (
          // 선택 상태 (Figma 미반영)
          <span className="flex size-6 items-center justify-center">
            <span className="flex size-5 items-center justify-center rounded-full bg-action-primary">
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4L3.5 6.5L9 1" stroke="var(--color-text-inverse)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </span>
        ) : (
          <Image src="/icons/setup/radio-unchecked.svg" alt="" width={24} height={24} unoptimized />
        )}
        <span className="text-body-m text-text-supporting">당일치기예요</span>
      </button>

      <CalendarModal
        key={calendarKey}
        open={calendarOpen}
        onClose={() => setCalendarOpen(false)}
        singleDate={value.isDayTrip}
        initialDeparture={value.departure}
        initialArrival={value.isDayTrip ? null : value.arrival}
        onSelect={(departure, arrival) => onChange({ departure, arrival: value.isDayTrip ? null : arrival })}
      />
    </>
  );
}

function CurrencySelect({ value, onChange }: { value: Currency | null; onChange: (v: Currency) => void }) {
  return (
    <label className="relative flex shrink-0 items-center rounded-12 border border-border-default bg-surface-default px-4 py-2">
      <span className="flex w-16 items-center gap-2 p-1">
        <span className="w-8 text-body-m text-text-primary">{value ?? "선택"}</span>
        <span className="flex h-2.5 w-4 items-center justify-center">
          <Image src="/icons/setup/chevron-forward.svg" alt="" width={9} height={16} unoptimized className="rotate-90" />
        </span>
      </span>
      {/* 보이는 건 위 라벨이고, 실제 선택은 기기 기본 선택창으로 한다 */}
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value as Currency)}
        aria-label="통화"
        className="absolute inset-0 cursor-pointer opacity-0"
      >
        <option value="" disabled>
          선택
        </option>
        {CURRENCIES.map((c) => (
          <option key={c} value={c}>
            {c} ({getCurrencyUnit(c)})
          </option>
        ))}
      </select>
    </label>
  );
}

function AmountInput({ value, unit, onChange }: { value: number | null; unit: string | null; onChange: (v: number | null) => void }) {
  return (
    <label className="flex h-12 min-w-0 flex-1 items-center justify-between gap-2 rounded-12 border border-border-default bg-surface-default px-4 py-2">
      <span className="flex min-w-0 items-center gap-1 text-body-m">
        <input
          value={value === null ? "" : value.toLocaleString("ko-KR")}
          onChange={(e) => {
            const digits = e.target.value.replace(/\D/g, "");
            onChange(digits ? Number(digits) : null);
          }}
          inputMode="numeric"
          aria-label="예산 금액"
          // 단위(원)가 숫자 바로 뒤에 붙도록 입력 폭을 내용에 맞춘다. size는 field-sizing 미지원 브라우저용
          size={Math.max(1, (value ?? 0).toLocaleString("ko-KR").length)}
          className="field-sizing-content min-w-0 bg-transparent text-text-action-secondary outline-none"
        />
        {value !== null && unit && <span className="shrink-0 font-bold text-text-primary">{unit}</span>}
      </span>
      <button
        type="button"
        onClick={() => onChange(null)}
        disabled={value === null}
        aria-label="금액 지우기"
        className="shrink-0"
      >
        <Image src="/icons/setup/circle-close.svg" alt="" width={16} height={16} unoptimized />
      </button>
    </label>
  );
}
