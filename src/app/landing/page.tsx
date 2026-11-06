"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import CategoryIcon from "@/components/ui/CategoryIcon";
import TripyCharacter from "@/components/ui/TripyCharacter";
import { CATEGORIES } from "@/lib/constants/categories";
import { markLandingSeen } from "@/lib/entry";
import Reveal from "./_components/Reveal";
import LandingCTAButton from "./_components/LandingCTAButton";
import LandingStepRow from "./_components/LandingStepRow";
import LandingFeatureSlide, {
  LandingVisualBudget,
  LandingVisualCategories,
  LandingVisualCurrency,
  LandingVisualGuest,
  LandingVisualTrips,
} from "./_components/LandingFeatureSlide";

// 디자인 기준: Figma `Landing (코드 기준)` 페이지의 LandingRedesign(1550:685)
// 첫 방문 사용자에게 01에서 한 번만 보여준다 (docs/flow-v2.md §5 「랜딩」)

const SLIDES = [
  { title: "간편한 지출 등록", description: "6가지 카테고리로 빠르게 기록하고, 카드·현금 결제도 나눠서 볼 수 있어요.", visual: <LandingVisualCategories /> },
  { title: "실시간 예산 관리", description: "여행 예산 대비 지금까지 쓴 돈을 한눈에. 예산 초과 걱정 없이 여행하세요.", visual: <LandingVisualBudget /> },
  { title: "4가지 통화 지원", description: "원·달러·엔·유로로 기록할 수 있어요. 해외여행도 완벽하게.", visual: <LandingVisualCurrency /> },
  { title: "지난 여행 돌아보기", description: "여행을 여러 개 만들고, 끝난 여행의 예산 결과와 지출 내역을 다시 봐요.", visual: <LandingVisualTrips /> },
  { title: "가입 없이 바로 기록", description: "로그인하지 않으면 이 기기에만 저장돼요. 나중에 로그인하면 계정으로 옮겨져요.", visual: <LandingVisualGuest /> },
];

const STEPS = [
  { step: "01", title: "여행 등록", description: "여행지·기간·예산을 한 화면에서 입력하세요. 국내외 어디든 등록할 수 있어요." },
  { step: "02", title: "지출 기록", description: "쓴 돈을 금액·결제 수단·카테고리로 기록하세요. 수정과 삭제도 바로 돼요." },
  { step: "03", title: "한눈에 확인", description: "홈에서 오늘 쓴 돈과 남은 예산을, 지난 여행에서 여행별 결과를 확인해요." },
];

const DELAY = ["lp-d1", "lp-d2", "lp-d3", "lp-d4", "lp-d5", "lp-d6", "lp-d7", "lp-d8"];

// 반투명 유리 카드
const GLASS = "rounded-20 border border-gray-white bg-gray-white/80 px-3.5 py-3 shadow-float backdrop-blur-md";

export default function LandingPage() {
  // 들어온 순간 본 것으로 기록한다. 다음부터 01은 온보딩으로 바로 보낸다
  useEffect(() => {
    markLandingSeen();
  }, []);

  return (
    <div className="min-h-screen-safe bg-gray-white">
      <Hero />
      <CategoryMarquee />
      <Features />
      <HowItWorks />
      <AppPreview />
      <ClosingCTA />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <Reveal className="bg-linear-to-b from-green-10 via-green-0 to-gray-white">
      <nav data-reveal="fade" className="flex items-center justify-between px-5 py-3.5">
        <Image src="/tripy-logo.svg" alt="트리피" width={67} height={24} priority />
        <LandingCTAButton size="S" label="시작하기" />
      </nav>

      <div className="flex flex-col items-center px-5 pb-6 pt-10 text-center">
        <h1 data-reveal="up" className="lp-d1 text-display-l font-semibold tracking-tighter text-gray-90">
          여행의 순간에
          <br />
          집중하세요
        </h1>
        <p data-reveal="up" className="lp-d2 mt-5 text-body-l text-gray-60">
          복잡한 지출 관리는 트리피에게 맡기고
          <br />
          여행의 설렘을 마음껏 즐기세요.
        </p>
        <div data-reveal="pop" className="lp-d4 mt-7">
          <LandingCTAButton label="무료로 시작하기" />
        </div>
        <p data-reveal="fade" className="lp-d5 mt-3 text-body-s text-gray-50">
          가입 없이 바로 시작 · 완전 무료
        </p>

        {/* 3D 주인공: 빛 + 트리피 + 떠 있는 유리 카드 */}
        <div className="relative mt-5 h-82 w-full text-left">
          <div data-reveal="pop" className="lp-d3 absolute inset-x-0 top-10 mx-auto size-65">
            <div className="lp-breathe size-full rounded-full bg-green-20 blur-3xl" />
          </div>
          <div data-reveal="up" className="lp-d4 absolute inset-x-0 top-7 mx-auto h-66 w-54">
            <div className="lp-float">
              {/* TripyCharacter 6(180x220)을 216x264로 키워 쓴다 */}
              <TripyCharacter variant={6} className="origin-top-left scale-120" />
            </div>
          </div>
          <div data-reveal="slide" className={`lp-d6 absolute right-0 top-6 w-38 ${GLASS}`}>
            <p className="text-body-s text-gray-50">남은 예산</p>
            <p className="text-body-l font-bold tracking-tight text-gray-90">
              350,000<span className="text-body-s font-medium">원</span>
            </p>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-gray-10">
              <div className="h-full w-13/20 rounded-full bg-linear-to-r from-green-30 to-green-50" />
            </div>
            <p className="mt-1 text-caption-s text-gray-50">예산 65% 사용</p>
          </div>
          <div data-reveal="pop" className={`lp-d7 absolute left-0 top-49 ${GLASS}`}>
            <p className="text-body-s text-gray-50">오늘 지출</p>
            <p className="text-body-l font-bold tracking-tight text-gray-90">
              52,000<span className="text-body-s font-medium">원</span>
            </p>
            <div className="mt-1 flex gap-1">
              <CategoryIcon category="food" size={18} />
              <CategoryIcon category="transport" size={18} />
              <CategoryIcon category="shopping" size={18} />
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function CategoryMarquee() {
  // 끊김 없이 돌도록 같은 목록을 두 번 이어 붙이고 -50%까지 민다
  const chips = [...CATEGORIES, ...CATEGORIES];
  return (
    <Reveal className="overflow-hidden pb-10 pt-5">
      <div data-reveal="fade" className="lp-d6">
        <div className="lp-marquee flex w-max gap-2">
          {chips.map((c, i) => (
            <span key={`${c.id}-${i}`} className="flex items-center gap-1.5 rounded-full bg-gray-5 py-2 pl-2.5 pr-3.5">
              <CategoryIcon category={c.id} size={18} />
              <span className="text-body-m font-medium text-gray-80">{c.label}</span>
            </span>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

function Features() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const onScroll = () => {
    const el = trackRef.current;
    const first = el?.firstElementChild as HTMLElement | null;
    if (!el || !first) return;
    // 카드 너비 + 간격 한 칸 단위로 지금 보이는 카드를 찾는다
    const step = first.offsetWidth + parseFloat(getComputedStyle(el).columnGap || "0");
    setActive(Math.min(SLIDES.length - 1, Math.round(el.scrollLeft / step)));
  };

  const goTo = (i: number) => {
    const card = trackRef.current?.children[i] as HTMLElement | undefined;
    card?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  };

  return (
    <Reveal className="py-16">
      <h2 data-reveal="up" className="px-5 text-headline-l font-semibold tracking-tight text-gray-90">
        여행 지출 관리,
        <br />
        이제 쉽고 스마트하게
      </h2>
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="mt-7 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 [scrollbar-width:none]"
      >
        {SLIDES.map((s, i) => (
          <LandingFeatureSlide key={s.title} {...s} className={`${DELAY[i]}`} data-reveal="slide" />
        ))}
      </div>
      <div data-reveal="fade" className="lp-d4 mt-4 flex gap-1.5 px-5">
        {SLIDES.map((s, i) => (
          <button
            key={s.title}
            type="button"
            aria-label={`${i + 1}번째 기능 보기`}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all ${i === active ? "w-5 bg-gray-90" : "w-1.5 bg-gray-20"}`}
          />
        ))}
      </div>
    </Reveal>
  );
}

function HowItWorks() {
  return (
    <Reveal className="px-5 pb-18 pt-6">
      <h2 data-reveal="up" className="text-headline-l font-semibold tracking-tight text-gray-90">
        3단계면
        <br />
        여행 가계부 완성
      </h2>
      <div className="mt-6">
        {STEPS.map((s, i) => (
          <div key={s.step} data-reveal="up" className={DELAY[i + 1]}>
            <LandingStepRow {...s} />
          </div>
        ))}
      </div>
    </Reveal>
  );
}

function AppPreview() {
  return (
    <Reveal className="px-5 pb-6">
      <div data-reveal="up" className="flex flex-col items-center gap-7 overflow-hidden rounded-30 bg-linear-to-b from-green-10 to-green-0 pt-10 text-center">
        <div className="flex flex-col gap-2.5 px-6">
          <h2 data-reveal="up" className="lp-d1 text-title-xl font-semibold tracking-tight text-gray-90">
            여행 중에 보는 화면,
            <br />
            이렇게 생겼어요
          </h2>
          <p data-reveal="up" className="lp-d2 text-body-m text-gray-60">
            오늘 쓴 돈과 남은 예산을 한눈에 확인해요.
          </p>
        </div>
        <div className="relative h-95 w-full">
          <div data-reveal="rise" className="lp-d3 absolute inset-x-0 top-0 mx-auto w-fit rounded-30 bg-gray-90 p-1.75 shadow-phone">
            <Image
              src="/images/landing/app-home.png"
              alt="트리피 홈 화면: 오늘 쓴 돈, 남은 금액, 지출 내역"
              width={240}
              height={512}
              className="h-128 w-60 rounded-20"
            />
          </div>
          <div data-reveal="pop" className={`lp-d6 absolute right-0 top-62 flex items-center gap-2.5 text-left ${GLASS}`}>
            <CategoryIcon category="accommodation" size={28} />
            <div>
              <p className="text-body-s text-gray-50">이번 여행 지출 1위</p>
              <p className="text-body-l font-bold tracking-tight text-gray-90">숙소 320,000원</p>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function ClosingCTA() {
  return (
    <Reveal className="flex flex-col items-center gap-5 px-5 py-18 text-center">
      <div data-reveal="pop" className="h-26 w-24">
        <div className="lp-float">
          {/* TripyCharacter 7(142x154)을 96x104로 줄여 쓴다 */}
          <TripyCharacter variant={7} className="origin-top-left scale-68" />
        </div>
      </div>
      <h2 data-reveal="up" className="lp-d1 text-headline-l font-semibold tracking-tighter text-gray-90">
        다음 여행,
        <br />
        트리피와 함께 떠나요
      </h2>
      <p data-reveal="up" className="lp-d2 text-body-l text-gray-60">
        로그인 없이 바로 첫 여행을 등록할 수 있어요.
      </p>
      <div data-reveal="pop" className="lp-d3">
        <LandingCTAButton label="무료로 시작하기" />
      </div>
    </Reveal>
  );
}

function Footer() {
  return (
    <footer className="flex flex-col gap-3.5 bg-gray-5 px-5 pb-10 pt-7">
      <Image src="/tripy-logo.svg" alt="트리피" width={67} height={24} />
      <p className="text-body-s text-gray-50">© 2026 Tripy. 여행의 모든 지출을 스마트하게.</p>
      <div className="flex gap-4 text-body-s font-medium text-gray-60">
        <a href="https://tulip-homegrown-8f7.notion.site/36de275303578051ae43da64326a72be" target="_blank" rel="noopener noreferrer">
          개인정보처리방침
        </a>
        <Link href="/mypage/settings">이용약관</Link>
      </div>
    </footer>
  );
}
