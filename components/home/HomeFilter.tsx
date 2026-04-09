interface HomeFilterProps {
  tripName: string;
  hasTrip: boolean;
  onFilterClick: () => void;
}

const FIGMA_FILTER_ICON =
  "http://localhost:3845/assets/a78eaf94c0338a10c2b4e7a09c6b8136c3d46c78.svg";

export default function HomeFilter({ tripName, hasTrip, onFilterClick }: HomeFilterProps) {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex flex-col items-start justify-center">
        <div className="flex items-center gap-1">
          <span className="whitespace-nowrap text-[16px] font-semibold leading-[1.5] text-gray-90">
            {hasTrip ? tripName : "여행 없음"}
          </span>
          <div className="flex h-5 items-center justify-center rounded-[30px] bg-gray-5 px-2 py-1">
            <span className="whitespace-nowrap text-[12px] font-normal leading-[1.5] text-gray-50">
              {hasTrip ? "진행중" : "대기중"}
            </span>
          </div>
        </div>
      </div>
      <button
        type="button"
        aria-label="카테고리 필터"
        onClick={onFilterClick}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-50 p-1.5 opacity-60"
      >
        <img src={FIGMA_FILTER_ICON} alt="" className="h-6 w-6" />
      </button>
    </div>
  );
}
