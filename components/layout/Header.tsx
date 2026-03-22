"use client";

interface HeaderProps {
  onBack?: () => void;
  title?: string;
}

export default function Header({ onBack, title }: HeaderProps) {
  return (
    <div className="flex items-center px-4 pb-4 pt-6">
      <button onClick={onBack} className="shrink-0">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M15 18L9 12L15 6"
            stroke="#1D1D1D"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {title && (
        <>
          <span className="flex-1 text-center text-base font-bold tracking-[-0.32px] text-gray-90">
            {title}
          </span>
          <div className="size-6 shrink-0" />
        </>
      )}
    </div>
  );
}
