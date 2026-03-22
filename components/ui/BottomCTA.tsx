"use client";

interface BottomCTAProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  secondaryLabel?: string;
  onSecondaryClick?: () => void;
}

export default function BottomCTA({
  label,
  onClick,
  disabled,
  secondaryLabel,
  onSecondaryClick,
}: BottomCTAProps) {
  return (
    <div className="border-t border-gray-20 bg-white px-4 pb-8 pt-4">
      <button
        onClick={onClick}
        disabled={disabled}
        className="flex h-14 w-full items-center justify-center rounded-xl bg-green-50 text-base font-bold text-white disabled:opacity-40"
      >
        {label}
      </button>
      {secondaryLabel && (
        <button
          onClick={onSecondaryClick}
          className="mt-3 flex w-full items-center justify-center text-sm text-gray-50"
        >
          {secondaryLabel}
        </button>
      )}
    </div>
  );
}
