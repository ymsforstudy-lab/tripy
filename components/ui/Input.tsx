"use client";

import { ReactNode } from "react";

type InputVariant = "default" | "focused" | "success" | "error";

interface InputProps {
  label?: string;
  icon?: ReactNode;
  disabled?: boolean;
  variant?: InputVariant;
  value?: string;
  placeholder?: string;
  helperText?: string;
  maxLength?: number;
  onChange?: (value: string) => void;
}

const borderStyles: Record<InputVariant, string> = {
  default: "border-gray-30",
  focused: "border-gray-60",
  success: "border-green-50",
  error: "border-danger-50",
};

const bgStyles: Record<InputVariant, string> = {
  default: "bg-gray-5",
  focused: "bg-white",
  success: "bg-white",
  error: "bg-white",
};

const helperTextStyles: Record<Exclude<InputVariant, "default" | "focused">, string> = {
  success: "text-green-50",
  error: "text-danger-50",
};

export default function Input({
  label,
  icon,
  disabled = false,
  variant = "default",
  value = "",
  placeholder,
  helperText,
  maxLength,
  onChange,
}: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <span className="text-sm font-medium text-gray-90">{label}</span>
      )}

      <div
        className={[
          "flex items-center gap-2 rounded-xl border px-3 py-3",
          borderStyles[variant],
          bgStyles[variant],
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
          className="flex-1 bg-transparent text-sm font-medium text-gray-90 outline-none placeholder:font-normal placeholder:text-gray-50 disabled:cursor-not-allowed"
        />
        {icon && <span className="shrink-0 text-gray-50">{icon}</span>}
      </div>

      {helperText && (variant === "success" || variant === "error") && (
        <p className={`text-xs tracking-[-0.24px] ${helperTextStyles[variant]}`}>
          {helperText}
        </p>
      )}
    </div>
  );
}
