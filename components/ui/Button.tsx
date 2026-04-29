"use client";

import { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps {
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  variant?: ButtonVariant;
  onClick?: () => void;
  type?: "button" | "submit";
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "h-14 rounded-xl bg-green-50 text-base font-bold text-white disabled:opacity-40",
  secondary:
    "h-14 rounded-xl border border-gray-30 text-base text-gray-50 opacity-50 disabled:opacity-30",
  ghost:
    "text-sm text-gray-50 disabled:opacity-40",
};

export default function Button({
  label,
  icon,
  disabled = false,
  variant = "primary",
  onClick,
  type = "button",
  fullWidth = true,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={[
        "flex items-center justify-center gap-2",
        variantStyles[variant],
        fullWidth ? "w-full" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {label}
    </button>
  );
}
