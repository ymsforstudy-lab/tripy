"use client";

import { ComponentProps, ReactNode } from "react";
import Input from "./Input";

type InputState = NonNullable<ComponentProps<typeof Input>["state"]>;

// Figma FormField(848:2387): 라벨 + Input + 중복확인 같은 액션 버튼 + 도움말
interface FormFieldProps {
  label?: string;
  showRequiredIcon?: boolean;
  state?: InputState;
  disabled?: boolean;
  value?: string;
  placeholder?: string;
  maxLength?: number;
  helperText?: string;
  icon?: ReactNode;
  onChange?: (value: string) => void;
  actionLabel?: string;
  onAction?: () => void;
  actionDisabled?: boolean;
}

const REQUIRED_MARK_IMG = "/icons/required-mark.svg";

export default function FormField({
  label,
  showRequiredIcon = false,
  state = "default",
  disabled = false,
  value,
  placeholder,
  maxLength,
  helperText,
  icon,
  onChange,
  actionLabel = "중복확인",
  onAction,
  actionDisabled = false,
}: FormFieldProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      {label && (
        <div className="flex items-start">
          <span className="text-body-m font-medium leading-default text-gray-90">{label}</span>
          {showRequiredIcon && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={REQUIRED_MARK_IMG} alt="필수" width={8} height={8} className="shrink-0" />
          )}
        </div>
      )}
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <Input
            value={value}
            placeholder={placeholder}
            maxLength={maxLength}
            state={state}
            disabled={disabled}
            helperText={helperText}
            icon={icon}
            onChange={onChange}
          />
        </div>
        <button
          type="button"
          onClick={onAction}
          disabled={disabled || actionDisabled}
          className="flex h-12 shrink-0 items-center justify-center rounded-12 bg-green-50 px-4 text-body-l font-semibold leading-default text-white disabled:opacity-50"
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}
