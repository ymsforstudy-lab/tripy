"use client";

import { ReactNode, useState } from "react";

type InputState = "default" | "focused" | "success" | "error";

interface InputProps {
  label?: string;
  icon?: ReactNode;
  disabled?: boolean;
  state?: InputState;
  value?: string;
  placeholder?: string;
  helperText?: string;
  maxLength?: number;
  onChange?: (value: string) => void;
}

const borderStyles: Record<InputState, string> = {
  default: "border-gray-30",
  focused: "border-gray-60",
  success: "border-green-50",
  error: "border-danger-50",
};

const bgStyles: Record<InputState, string> = {
  default: "bg-gray-5",
  focused: "bg-white",
  success: "bg-white",
  error: "bg-white",
};

const helperTextStyles: Record<Exclude<InputState, "default" | "focused">, string> = {
  success: "text-green-50",
  error: "text-danger-50",
};

export default function Input({
  label,
  icon,
  disabled = false,
  state = "default",
  value = "",
  placeholder,
  helperText,
  maxLength,
  onChange,
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const effectiveState =
    state === "success" || state === "error"
      ? state
      : isFocused
        ? "focused"
        : state;

  return (
    <div className="flex w-full flex-col gap-1">
      {label && (
        <span className="text-sm font-medium text-gray-90">{label}</span>
      )}

      <div
        className={[
          "flex items-center gap-2 rounded-xl border px-3 py-3",
          borderStyles[effectiveState],
          bgStyles[effectiveState],
          disabled ? "opacity-50" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <input
          value={value}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="min-w-0 flex-1 bg-transparent text-base font-medium text-gray-90 outline-none placeholder:font-normal placeholder:text-gray-50 disabled:cursor-not-allowed"
        />
        {icon && <span className="shrink-0 text-gray-50">{icon}</span>}
      </div>

      {helperText && (state === "success" || state === "error") && (
        <p className={`text-xs tracking-[-0.24px] ${helperTextStyles[state]}`}>
          {helperText}
        </p>
      )}
    </div>
  );
}
