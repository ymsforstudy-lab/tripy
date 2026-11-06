import CategoryIcon from "@/components/ui/CategoryIcon";
import TripyCharacter from "@/components/ui/TripyCharacter";
import { CATEGORIES } from "@/lib/constants/categories";
import { CURRENCIES, CURRENCY_UNIT } from "@/lib/constants/currency";

interface LandingFeatureSlideProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  title: string;
  description: string;
  /** 위쪽 그림 영역 (LandingVisual*) */
  visual: React.ReactNode;
  /** landing.css 등장 애니메이션 종류. 슬라이드 트랙에서는 "slide" */
  "data-reveal"?: string;
}

/** 랜딩 기능 소개 슬라이드 카드 (Figma LandingFeatureSlide) */
export default function LandingFeatureSlide({ title, description, visual, className = "", ...rest }: LandingFeatureSlideProps) {
  return (
    <article {...rest} className={`flex w-70 shrink-0 snap-start flex-col gap-5 rounded-30 bg-linear-to-b from-green-0 to-gray-5 p-6 ${className}`}>
      <div className="h-30">{visual}</div>
      <div className="flex flex-col gap-1.5">
        <h3 className="text-title-m font-semibold tracking-tight text-gray-90">{title}</h3>
        <p className="text-body-m text-gray-60">{description}</p>
      </div>
    </article>
  );
}

/* ── 슬라이드 그림 5종 (Figma LandingVisual*) ── */

export function LandingVisualCategories() {
  return (
    <div className="grid w-fit grid-cols-3 gap-2.5">
      {CATEGORIES.map((c) => (
        <span key={c.id} className="flex size-13 items-center justify-center rounded-16 bg-gray-white">
          <CategoryIcon category={c.id} size={26} />
        </span>
      ))}
    </div>
  );
}

export function LandingVisualBudget() {
  return (
    <div className="flex h-full flex-col justify-end gap-2.5">
      <span className="text-display-l font-semibold tracking-tighter text-green-50">65%</span>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-white">
        <div className="h-full w-13/20 rounded-full bg-linear-to-r from-green-30 to-green-50" />
      </div>
      <span className="text-body-s text-gray-50">예산 1,000,000원 중 650,000원 사용</span>
    </div>
  );
}

export function LandingVisualCurrency() {
  return (
    <div className="flex h-full flex-wrap content-end gap-2">
      {CURRENCIES.map((code) => (
        <span key={code} className="flex items-center gap-1.5 rounded-full bg-gray-white px-3.5 py-2.5">
          <span className="text-body-m font-semibold text-gray-90">{code}</span>
          <span className="text-body-s text-gray-50">{CURRENCY_UNIT[code]}</span>
        </span>
      ))}
    </div>
  );
}

const SAMPLE_TRIPS = [
  { name: "일본 · 3박4일", rate: 92, over: false, bar: "w-23/25" },
  { name: "베트남 · 4박5일", rate: 108, over: true, bar: "w-full" },
];

export function LandingVisualTrips() {
  return (
    <div className="flex h-full flex-col justify-end gap-2">
      {SAMPLE_TRIPS.map((t) => (
        <div key={t.name} className="flex flex-col gap-1.5 rounded-16 bg-gray-white px-3.5 py-2.5">
          <div className="flex justify-between">
            <span className="text-body-m font-semibold text-gray-90">{t.name}</span>
            <span className={`text-body-s font-medium ${t.over ? "text-danger-50" : "text-gray-50"}`}>예산 {t.rate}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-10">
            <div className={`h-full rounded-full ${t.bar} ${t.over ? "bg-danger-50" : "bg-green-50"}`} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function LandingVisualGuest() {
  return (
    <div className="flex h-full items-end gap-3">
      {/* TripyCharacter 7(142x154)을 88x96으로 줄여 쓴다 */}
      <div className="h-24 w-22 shrink-0">
        <TripyCharacter variant={7} className="origin-top-left scale-62" />
      </div>
      <p className="mb-3 rounded-16 bg-gray-white px-3.5 py-2.5 text-body-m font-semibold text-gray-80">
        로그인 없이
        <br />
        바로 써 봐요!
      </p>
    </div>
  );
}
