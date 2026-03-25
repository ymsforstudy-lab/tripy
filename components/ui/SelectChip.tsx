"use client";

import { ReactNode } from "react";

type SelectChipVariant = "default" | "selected" | "tag";

interface SelectChipProps {
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  variant?: SelectChipVariant;
  onClick?: () => void;
  onRemove?: () => void;
}

export default function SelectChip({
  label,
  icon,
  disabled = false,
  variant = "default",
  onClick,
  onRemove,
}: SelectChipProps) {
  // 태그 형태: 상단에 선택된 항목 표시 (X 제거 버튼 포함)
  if (variant === "tag") {
    return (
      <div className="flex items-center gap-1 rounded-xl bg-green-10 px-3 py-2">
        {icon && <span className="shrink-0">{icon}</span>}
        <span className="text-sm font-medium text-green-60">{label}</span>
        {onRemove && (
          <button
            onClick={onRemove}
            disabled={disabled}
            className="ml-0.5 shrink-0 disabled:opacity-40"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M3.5 3.5L10.5 10.5M10.5 3.5L3.5 10.5"
                stroke="#4B8A09"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
      </div>
    );
  }

  // 리스트 아이템 형태: 목록에서 선택/미선택 상태
  const itemStyles =
    variant === "selected"
      ? "border-green-20 bg-green-0 font-medium"
      : "border-gray-20 bg-white font-normal";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={[
        "flex w-full items-center justify-center gap-1 rounded-xl border px-6 py-4 text-sm text-gray-90 disabled:opacity-40",
        itemStyles,
      ].join(" ")}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {label}
    </button>
  );
}
