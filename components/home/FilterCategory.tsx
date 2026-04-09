export const CATEGORY_FILTERS = [
  { id: "accommodation", label: "숙소" },
  { id: "food", label: "식비" },
  { id: "transport", label: "교통" },
  { id: "activity", label: "액티비티" },
  { id: "shopping", label: "쇼핑" },
  { id: "etc", label: "기타" },
];

interface FilterCategoryProps {
  selectedCategories: string[];
  onToggle: (id: string) => void;
  onClose: () => void;
}

export default function FilterCategory({
  selectedCategories,
  onToggle,
  onClose,
}: FilterCategoryProps) {
  return (
    <div className="absolute top-[42px] right-0 z-50 flex w-[211px] flex-col rounded-2xl border border-gray-40 bg-white p-4">
      <div className="flex w-full flex-col gap-3">
        <div className="mb-1 flex w-full items-center justify-between">
          <span className="text-[14px] font-bold leading-[1.5] text-gray-90">
            카테고리
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="카테고리 필터 닫기"
            className="flex h-4 w-4 items-center justify-center text-gray-90"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="flex w-full flex-col gap-2">
          {CATEGORY_FILTERS.map((cat) => {
            const active = selectedCategories.includes(cat.id);
            return (
              <button
                type="button"
                key={cat.id}
                onClick={() => onToggle(cat.id)}
                className="flex w-full items-center gap-[9px] cursor-pointer"
              >
                <div
                  className={`flex h-3.5 w-3.5 items-center justify-center rounded-[2px] border ${
                    active ? "border-green-50 bg-green-50" : "border-gray-30 bg-white"
                  }`}
                >
                  {active && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L4 7L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <div className="flex items-center justify-center rounded bg-green-0 px-2 py-1">
                  <span className="text-[12px] leading-[1.5] text-gray-90">
                    {cat.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
