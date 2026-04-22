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
}: CalendarModalProps) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth() + 1);
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

  const getDayStyle = (day: number) => {
    const date: DateValue = { year: viewYear, month: viewMonth, day };
    const isStart = start && isSameDate(date, start);
    const isEnd = end && isSameDate(date, end);
    const inRange = start && end && isInRange(date, start, end);

    if (isStart || isEnd)
      return "bg-green-50 text-white font-bold rounded-full";
    if (!singleDate && inRange)
      return "bg-green-10 text-gray-90 rounded-none";
    return "text-gray-90";
  };

  const cells: (number | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const formatDate = (d: DateValue) =>
    `${d.year}년 ${d.month}월 ${d.day}일`;

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
                stroke="#1D1D1D"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* 선택된 날짜 표시 */}
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-gray-5 px-4 py-3 text-sm">
          <span className={start ? "font-medium text-gray-90" : "text-gray-50"}>
            {start ? formatDate(start) : singleDate ? "날짜" : "출발일"}
          </span>
          {!singleDate && (
            <>
              <span className="text-gray-40">~</span>
              <span className={end ? "font-medium text-gray-90" : "text-gray-50"}>
                {end ? formatDate(end) : "도착일"}
              </span>
            </>
          )}
        </div>

        {/* 월 이동 */}
        <div className="mb-3 flex items-center justify-between">
          <button onClick={handlePrevMonth} className="p-1">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M13 16L7 10L13 4"
                stroke="#1D1D1D"
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
                stroke="#1D1D1D"
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
                <button
                  onClick={() => handleDayClick(day)}
                  className={`mx-auto flex size-9 items-center justify-center text-sm ${getDayStyle(day)}`}
                >
                  {day}
                </button>
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
