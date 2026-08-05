"use client";

import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  visible: boolean;
}

export default function Toast({ message, visible }: ToastProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [visible]);

  if (!visible && !show) return null;

  return (
    <div
      className={`fixed bottom-8 left-1/2 z-50 -translate-x-1/2 transition-all duration-300 ${
        show ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      <div className="flex h-12 w-[327px] items-center gap-[7px] rounded-2xl bg-gray-80 px-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="12" fill="#2D6A1E" />
          <path
            d="M7 12.5L10.5 16L17 9"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="whitespace-nowrap text-[14px] leading-[1.5] text-white">
          {message}
        </span>
      </div>
    </div>
  );
}
