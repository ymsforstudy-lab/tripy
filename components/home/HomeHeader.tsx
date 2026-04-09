import Image from "next/image";

export default function HomeHeader() {
  return (
    <header className="flex w-full items-center justify-between px-4 pb-4 pt-6">
      <div className="relative h-6 w-[66.843px]">
        <Image src="/tripy-logo.svg" alt="Tripy" fill className="object-contain" />
      </div>
      <button
        type="button"
        aria-label="메뉴 열기"
        className="flex h-6 w-6 items-center justify-center"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M4 6H20M4 12H20M4 18H20" stroke="#1D1D1D" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </header>
  );
}
