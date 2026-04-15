interface HomeFilterProps {
  tripName: string;
  hasTrip: boolean;
  tripDateRange?: string;
  onFilterClick: () => void;
}

export default function HomeFilter({ tripName, hasTrip, tripDateRange, onFilterClick }: HomeFilterProps) {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex flex-col items-start justify-center">
        <div className="flex items-center gap-1">
          <span className="whitespace-nowrap text-[16px] font-semibold leading-[1.5] text-gray-90">
            {hasTrip ? tripName : "여행 없음"}
          </span>
          <div className={`flex h-5 items-center justify-center rounded-[30px] px-2 py-1 ${hasTrip ? "bg-info-5" : "bg-gray-5"}`}>
            <span className={`whitespace-nowrap text-[12px] font-bold leading-[1.5] ${hasTrip ? "text-info-50" : "text-gray-50"}`}>
              {hasTrip ? "진행중" : "대기중"}
            </span>
          </div>
        </div>
        {hasTrip && tripDateRange && (
          <span className="whitespace-nowrap text-[12px] font-normal leading-[1.5] text-gray-50">
            {tripDateRange}
          </span>
        )}
      </div>
      <button
        type="button"
        aria-label="카테고리 필터"
        onClick={onFilterClick}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-50 p-1.5 opacity-60"
      >
        <svg width="19.2" height="19.2" viewBox="0 0 19.2 19.2" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.6 1.2L3.6 18" stroke="#2D2D2D" strokeWidth="1.68" strokeLinecap="round"/>
          <path d="M9.6 1.2L9.6 18" stroke="#2D2D2D" strokeWidth="1.68" strokeLinecap="round"/>
          <path d="M15.6 1.2L15.6 18" stroke="#2D2D2D" strokeWidth="1.68" strokeLinecap="round"/>
          <rect x="1.8" y="6.84" width="3.6" height="3.6" rx="1.8" fill="white" stroke="#2D2D2D" strokeWidth="1.68"/>
          <rect x="8.04" y="10.44" width="3.6" height="3.6" rx="1.8" fill="white" stroke="#2D2D2D" strokeWidth="1.68"/>
          <rect x="13.8" y="4.44" width="3.6" height="3.6" rx="1.8" fill="white" stroke="#2D2D2D" strokeWidth="1.68"/>
        </svg>
      </button>
    </div>
  );
}
