import Link from "next/link";

interface LandingCTAButtonProps {
  label: string;
  /** L: 첫 화면·마지막 시작 버튼(화살표 원 포함), S: 상단 메뉴 버튼 */
  size?: "L" | "S";
  href?: string;
}

// 초록 그라데이션 + 빛 그림자. 랜딩의 모든 시작 버튼은 03 온보딩으로 간다 (docs/flow-v2.md §5 「랜딩」)
const BASE = "rounded-full bg-linear-to-r from-green-40 to-green-60 font-bold text-gray-white shadow-cta-glow";

export default function LandingCTAButton({ label, size = "L", href = "/onboarding" }: LandingCTAButtonProps) {
  if (size === "S") {
    return (
      <Link href={href} className={`${BASE} px-4 py-2 text-body-m`}>
        {label}
      </Link>
    );
  }

  return (
    <Link href={href} className={`${BASE} relative isolate inline-flex items-center gap-3.5 py-2.5 pl-7 pr-2.5 text-body-l tracking-tight`}>
      {/* 버튼 뒤에서 숨 쉬듯 커졌다 작아지는 빛 */}
      <span aria-hidden className="lp-aura absolute inset-0 -z-10 rounded-full bg-green-40 blur-xl" />
      {label}
      <span aria-hidden className="flex size-9 items-center justify-center rounded-full bg-gray-white text-green-60">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 8H13M13 8L8.5 3.5M13 8L8.5 12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </Link>
  );
}
