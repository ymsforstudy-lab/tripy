import Image from "next/image";

export default function HomeHeader() {
  return (
    <header className="flex w-full items-center justify-between px-4 pb-4 pt-6">
      <div className="relative h-6 w-[66.843px]">
        <Image src="/tripy-logo.svg" alt="Tripy" fill className="object-contain" />
      </div>
      <button aria-label="메뉴" className="flex size-6 items-center justify-center text-gray-90">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M3 6H21M3 12H21M3 18H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </header>
  );
}
