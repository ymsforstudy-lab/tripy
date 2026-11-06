interface HomeFilterProps {
  onFilterClick: () => void;
}

export default function HomeFilter({ onFilterClick }: HomeFilterProps) {
  return (
    <div className="flex w-full items-center justify-between">
      <span className="text-body-l font-semibold leading-default text-gray-90">지출 내역</span>
      <button
        type="button"
        aria-label="카테고리 필터"
        onClick={onFilterClick}
        className="flex size-6 items-center justify-center rounded-8 p-1 opacity-60"
      >
        <svg width="20" height="20" viewBox="0 0 19.2 19.2" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.59998 1.19998L3.59997 18" stroke="var(--color-gray-80)" strokeWidth="1.68" strokeLinecap="round"/>
          <path d="M9.59998 1.19998L9.59997 18" stroke="var(--color-gray-80)" strokeWidth="1.68" strokeLinecap="round"/>
          <path d="M15.6 1.19998L15.6 18" stroke="var(--color-gray-80)" strokeWidth="1.68" strokeLinecap="round"/>
          <rect x="1.80091" y="6.83998" width="3.6" height="3.6" rx="1.8" fill="var(--color-gray-white)" stroke="var(--color-gray-80)" strokeWidth="1.68"/>
          <rect x="8.03998" y="10.44" width="3.6" height="3.6" rx="1.8" fill="var(--color-gray-white)" stroke="var(--color-gray-80)" strokeWidth="1.68"/>
          <rect x="13.8009" y="4.43998" width="3.6" height="3.6" rx="1.8" fill="var(--color-gray-white)" stroke="var(--color-gray-80)" strokeWidth="1.68"/>
        </svg>
      </button>
    </div>
  );
}
