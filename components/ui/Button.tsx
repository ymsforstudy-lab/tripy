"use client";

import { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "L" | "M";

interface ButtonProps {
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  onClick?: () => void;
  type?: "button" | "submit";
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "rounded-xl bg-green-50 text-base font-semibold leading-[1.5] text-white disabled:opacity-50",
  secondary:
    "rounded-xl border border-gray-50 bg-white text-base font-semibold leading-[1.5] text-gray-80 opacity-50 disabled:border-gray-30 disabled:bg-gray-20 disabled:text-gray-40",
  ghost:
    "text-sm text-gray-50 disabled:opacity-40",
};

export default function Button({
  label,
  icon,
  disabled = false,
  variant = "primary",
  size = "L",
  onClick,
  type = "button",
  fullWidth = true,
}: ButtonProps) {
  const sizeClass = variant !== "ghost" ? (size === "L" ? "h-14" : "h-12") : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={[
        "flex items-center justify-center gap-2",
        sizeClass,
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
