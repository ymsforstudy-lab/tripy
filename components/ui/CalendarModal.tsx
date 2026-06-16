"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

interface DateValue {
  year: number;
  month: number;
  day: number;
}

interface CalendarModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (departure: DateValue, arrival: DateValue | null) => void;
  initialDeparture?: DateValue | null;
  initialArrival?: DateValue | null;
  singleDate?: boolean;
  minDate?: DateValue | null;
  maxDate?: DateValue | null;
}

const DAYS_OF_WEEK = ["일", "월", "화", "수", "목", "금", "토"];

function isSameDate(a: DateValue, b: DateValue) {
  return a.year === b.year && a.month === b.month && a.day === b.day;
}

function isInRange(date: DateValue, start: DateValue, end: DateValue) {
  const d = date.year * 10000 + date.month * 100 + date.day;
  const s = start.year * 10000 + start.month * 100 + start.day;
  const e = end.year * 10000 + end.month * 100 + end.day;
  return d > s && d < e;
}

function compareDates(a: DateValue, b: DateValue) {
  return (
    a.year * 10000 + a.month * 100 + a.day -
    (b.year * 10000 + b.month * 100 + b.day)
  );
}

function isRangeStart(date: DateValue, start: DateValue | null) {
  if (!start) return false;
  return isSameDate(date, start);
}

function isRangeEnd(date: DateValue, end: DateValue | null) {
  if (!end) return false;
  return isSameDate(date, end);
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month - 1, 1).getDay();
}

export default function CalendarModal({
  open,
  onClose,
  onSelect,
  initialDeparture,
  initialArrival,
  singleDate = false,
  minDate = null,
  maxDate = null,
}: CalendarModalProps) {
  const today = new Date();
  const initialYear = initialDeparture?.year ?? minDate?.year ?? today.getFullYear();
  const initialMonth = initialDeparture?.month ?? minDate?.month ?? (today.getMonth() + 1);
  const [viewYear, setViewYear] = useState(initialYear);
  const [viewMonth, setViewMonth] = useState(initialMonth);
  const [start, setStart] = useState<DateValue | null>(initialDeparture ?? null);
  const [end, setEnd] = useState<DateValue | null>(initialArrival ?? null);

  if (!open) return null;

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDow = getFirstDayOfWeek(viewYear, viewMonth);

  const handlePrevMonth = () => {
    if (viewMonth === 1) {
      setViewYear((y) => y - 1);
      setViewMonth(12);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 12) {
      setViewYear((y) => y + 1);
      setViewMonth(1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleDayClick = (day: number) => {
    const clicked: DateValue = { year: viewYear, month: viewMonth, day };
    if (
      (minDate && compareDates(clicked, minDate) < 0) ||
      (maxDate && compareDates(clicked, maxDate) > 0)
    ) {
      return;
    }

    if (singleDate) {
      setStart(clicked);
      setEnd(null);
      return;
    }

    if (!start || (start && end)) {
      setStart(clicked);
      setEnd(null);
    } else {
      if (compareDates(clicked, start) < 0) {
        setStart(clicked);
        setEnd(null);
      } else {
        setEnd(clicked);
      }
    }
  };

  const getDayCellState = (day: number) => {
    const date: DateValue = { year: viewYear, month: viewMonth, day };
    const isStart = isRangeStart(date, start);
    const isEnd = isRangeEnd(date, end);
    const inRange = start && end && isInRange(date, start, end);
    const isSameStartEnd = start && end && isSameDate(start, end);
    const isDisabled =
      (minDate && compareDates(date, minDate) < 0) ||
      (maxDate && compareDates(date, maxDate) > 0);

    return {
      isStart,
      isEnd,
      inRange: Boolean(inRange),
      isSameStartEnd: Boolean(isSameStartEnd),
      isDisabled: Boolean(isDisabled),
    };
  };

  const cells: (number | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const formatDate = (d: DateValue) => `${d.year}년 ${d.month}월 ${d.day}일`;

  const startLabel = start ? formatDate(start) : singleDate ? "날짜" : "출발일";
  const endLabel = end ? formatDate(end) : "도착일";

  return (
    <Modal open={open} onClose={onClose}>
      <div className="rounded-t-2xl bg-white px-4 pb-8 pt-6">
        {/* 헤더 */}
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xl font-bold text-gray-90">날짜 선택</span>
          <button onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M4 4L16 16M16 4L4 16"
                stroke="var(--color-gray-90)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* 선택된 날짜 표시 */}
        <div className="mb-4 rounded-xl bg-gray-5 px-4 py-3 text-sm">
          {singleDate ? (
            <span className={start ? "font-medium text-gray-90" : "text-gray-50"}>
              {startLabel}
            </span>
          ) : (
            <div className="flex items-center">
              <span
                className={`flex-1 text-left ${
                  start ? "font-medium text-gray-90" : "text-gray-50"
                }`}
              >
                {startLabel}
              </span>
              <span className="w-6 text-center text-gray-40">~</span>
              <span
                className={`flex-1 text-right ${
                  end ? "font-medium text-gray-90" : "text-gray-50"
                }`}
              >
                {endLabel}
              </span>
            </div>
          )}
        </div>

        {/* 월 이동 */}
        <div className="mb-3 flex items-center justify-between">
          <button onClick={handlePrevMonth} className="p-1">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M13 16L7 10L13 4"
                stroke="var(--color-gray-90)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <span className="text-base font-bold text-gray-90">
            {viewYear}년 {viewMonth}월
          </span>
          <button onClick={handleNextMonth} className="p-1">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M7 4L13 10L7 16"
                stroke="var(--color-gray-90)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* 요일 헤더 */}
        <div className="mb-1 grid grid-cols-7 text-center">
          {DAYS_OF_WEEK.map((d) => (
            <span key={d} className="py-1 text-xs font-medium text-gray-50">
              {d}
            </span>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div className="grid grid-cols-7 text-center">
          {cells.map((day, i) => (
            <div key={i} className="py-0.5">
              {day ? (
                (() => {
                  const { isStart, isEnd, inRange, isSameStartEnd, isDisabled } =
                    getDayCellState(day);
                  const showRightHalf = !singleDate && isStart && end && !isSameStartEnd;
                  const showLeftHalf = !singleDate && isEnd && start && !isSameStartEnd;

                  return (
                    <div className="relative h-9 w-full">
                      {inRange && (
                        <div className="absolute inset-0 bg-green-10" />
                      )}
                      {showRightHalf && (
                        <div className="absolute inset-y-0 left-1/2 right-0 bg-green-10" />
                      )}
                      {showLeftHalf && (
                        <div className="absolute inset-y-0 left-0 right-1/2 bg-green-10" />
                      )}
                      <button
                        type="button"
                        disabled={isDisabled}
                        onClick={() => handleDayClick(day)}
                        className={`relative z-10 mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm ${
                          isStart || isEnd
                            ? "bg-gradient font-bold text-white"
                            : isDisabled
                              ? "cursor-not-allowed text-gray-30 opacity-50"
                              : "text-gray-90"
                        }`}
                      >
                        {day}
                      </button>
                    </div>
                  );
                })()
              ) : (
                <div className="size-9" />
              )}
            </div>
          ))}
        </div>

        {/* 확인 버튼 */}
        <div className="mt-4">
          <Button
            label="확인"
            disabled={!start}
            onClick={() => {
              if (start) {
                onSelect(start, end ?? null);
                onClose();
              }
            }}
          />
        </div>
      </div>
    </Modal>
  );
}
