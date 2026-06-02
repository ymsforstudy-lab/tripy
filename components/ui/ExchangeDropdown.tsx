
"use client";

import { useEffect, useRef, useState } from "react";
import { CURRENCIES, CURRENCY_UNIT, type Currency } from "@/lib/constants/currency";

interface ExchangeDropdownProps {
  value: Currency;
  onChange: (value: Currency) => void;
}

export default function ExchangeDropdown({
  value,
  onChange,
}: ExchangeDropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-xl bg-white px-2.5 py-2"
        aria-label="통화 선택 열기"
      >
        <span className="text-[12px] font-bold text-gray-90">
          {value}({CURRENCY_UNIT[value]})
        </span>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          className={`transition-transform ${open ? "rotate-[270deg]" : "rotate-90"}`}
        >
          <path
            d="M7 5L12 10L7 15"
            stroke="var(--color-gray-90)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-[44px] z-20 w-40 overflow-hidden rounded-xl border border-gray-30 bg-white shadow-md">
          {CURRENCIES.map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => {
                onChange(code);
                setOpen(false);
              }}
              className={`flex w-full items-center px-4 py-2 text-sm transition-colors hover:bg-gray-5 ${
                code === value
                  ? "bg-gray-5 font-medium text-gray-90"
                  : "text-gray-90"
              }`}
            >
              {code}({CURRENCY_UNIT[code]})
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
