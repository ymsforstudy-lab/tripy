interface HomeFilterProps {
  tripName: string;
  hasTrip: boolean;
  dateRange?: string;
  nightsLabel?: string;
  onFilterClick: () => void;
}

export default function HomeFilter({
  tripName,
  hasTrip,
  dateRange,
  nightsLabel,
  onFilterClick,
}: HomeFilterProps) {
  return (
    <div className="flex w-full items-start justify-between">
      <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-0.5">
        <div className="flex items-center gap-1">
          <span className="truncate text-[16px] font-semibold leading-[1.5] text-gray-90">
            {hasTrip ? tripName : "여행 없음"}
          </span>
          <div className="flex h-5 items-center justify-center rounded-[30px] bg-info-5 px-2 py-1">
            <span className="whitespace-nowrap text-[12px] font-bold leading-[1.5] text-info-50">
              {hasTrip ? "진행중" : "대기중"}
            </span>
          </div>
        </div>
        {hasTrip && (dateRange || nightsLabel) && (
          <div className="flex items-center gap-1 text-[12px] leading-[1.5] text-gray-50">
            {dateRange && <span>{dateRange}</span>}
            {dateRange && nightsLabel && (
              <span aria-hidden className="inline-block size-[2px] rounded-full bg-gray-50" />
            )}
            {nightsLabel && <span>{nightsLabel}</span>}
          </div>
        )}
      </div>
      <button
        type="button"
        aria-label="카테고리 필터"
        onClick={onFilterClick}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-50 p-1.5 opacity-60"
      >
        <svg width="20" height="20" viewBox="0 0 19.2 19.2" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.59998 1.19998L3.59997 18" stroke="var(--color-gray-80)" strokeWidth="1.68" strokeLinecap="round"/>
          <path d="M9.59998 1.19998L9.59997 18" stroke="var(--color-gray-80)" strokeWidth="1.68" strokeLinecap="round"/>
          <path d="M15.6 1.19998L15.6 18" stroke="var(--color-gray-80)" strokeWidth="1.68" strokeLinecap="round"/>
          <rect x="1.80091" y="6.83998" width="3.6" height="3.6" rx="1.8" fill="white" stroke="var(--color-gray-80)" strokeWidth="1.68"/>
          <rect x="8.03998" y="10.44" width="3.6" height="3.6" rx="1.8" fill="white" stroke="var(--color-gray-80)" strokeWidth="1.68"/>
          <rect x="13.8009" y="4.43998" width="3.6" height="3.6" rx="1.8" fill="white" stroke="var(--color-gray-80)" strokeWidth="1.68"/>
        </svg>
      </button>
    </div>
  );
}
