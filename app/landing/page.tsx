"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-5">
      {/* 모바일 고정 너비 중앙 컨테이너 */}
      <div className="mx-auto w-full max-w-[390px] bg-white shadow-[0px_0px_40px_rgba(0,0,0,0.08)]">

        {/* ① Nav */}
        <nav className="sticky top-0 z-50 border-b border-gray-20 bg-white/90 backdrop-blur-sm">
          <div className="flex items-center justify-between px-5 py-4">
            <Link href="/">
              <Image src="/tripy-logo.svg" alt="트리피" width={72} height={24} />
            </Link>
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="rounded-xl bg-green-50 px-4 py-2 text-[13px] font-semibold text-white"
              >
                무료로 시작하기
              </Link>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex size-9 items-center justify-center rounded-lg border border-gray-20"
                aria-label="메뉴"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  {menuOpen ? (
                    <path d="M3 3L15 15M15 3L3 15" stroke="var(--color-gray-80)" strokeWidth="1.8" strokeLinecap="round" />
                  ) : (
                    <>
                      <path d="M2 5H16" stroke="var(--color-gray-80)" strokeWidth="1.8" strokeLinecap="round" />
                      <path d="M2 9H16" stroke="var(--color-gray-80)" strokeWidth="1.8" strokeLinecap="round" />
                      <path d="M2 13H16" stroke="var(--color-gray-80)" strokeWidth="1.8" strokeLinecap="round" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>
          {menuOpen && (
            <div className="border-t border-gray-10 bg-white px-5 py-2">
              {[
                { href: "#features", label: "기능" },
                { href: "#how", label: "사용방법" },
                { href: "#preview", label: "미리보기" },
                { href: "/home", label: "로그인" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex w-full items-center py-3 text-[14px] font-medium text-gray-70"
                >
                  {item.label}
                </a>
              ))}
            </div>
          )}
        </nav>

        {/* ② Hero */}
        <section className="flex flex-col items-center gap-8 px-5 py-12">
          <div className="flex flex-col items-center gap-5 text-center">
            <span className="rounded-full bg-green-10 px-4 py-1.5 text-[12px] font-semibold text-green-60">
              ✈️ 여행 가계부 서비스 트리피
            </span>
            <h1 className="text-[34px] font-bold leading-[1.2] tracking-[-0.68px] text-gray-90">
              여행의 순간에<br />
              <span className="text-green-50">집중하세요</span>
            </h1>
            <p className="text-[15px] leading-[1.7] text-gray-60">
              복잡한 지출 관리는 트리피에게 맡기고<br />
              여행의 설렘을 마음껏 즐기세요.
            </p>
          </div>

          {/* 캐릭터 + 플로팅 카드 */}
          <div className="relative flex h-[280px] w-full items-center justify-center">
            <div className="absolute h-[240px] w-[240px] rounded-full bg-green-10 opacity-60" />
            <div className="relative z-10 h-[240px] w-[190px]">
              <Image src="/tripy-character.png" alt="트리피 캐릭터" fill className="object-contain" />
            </div>
            <div className="absolute left-0 top-6 z-20 w-[148px] rounded-2xl bg-white p-3 shadow-[0px_6px_24px_rgba(0,0,0,0.10)]">
              <p className="text-[11px] text-gray-50">여행 예산</p>
              <p className="mt-0.5 text-[16px] font-bold text-gray-90">1,000,000<span className="text-[10px] font-normal text-gray-50">원</span></p>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-gray-10">
                <div className="h-full w-[65%] rounded-full bg-green-50" />
              </div>
              <p className="mt-0.5 text-[10px] text-gray-50">65% 사용 중</p>
            </div>
            <div className="absolute bottom-6 right-0 z-20 w-[136px] rounded-2xl bg-white p-3 shadow-[0px_6px_24px_rgba(0,0,0,0.10)]">
              <p className="text-[11px] text-gray-50">오늘 지출</p>
              <p className="mt-0.5 text-[16px] font-bold text-gray-90">52,000<span className="text-[10px] font-normal text-gray-50">원</span></p>
              <div className="mt-1.5 flex items-center gap-1">
                <span className="flex h-5 w-5 items-center justify-center rounded-md bg-green-10 text-[10px]">🍜</span>
                <span className="flex h-5 w-5 items-center justify-center rounded-md bg-info-5 text-[10px]">🚌</span>
                <span className="flex h-5 w-5 items-center justify-center rounded-md bg-green-0 text-[10px]">🛍️</span>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col gap-3">
            <Link href="/" className="flex h-[52px] w-full items-center justify-center rounded-xl bg-green-50 text-[15px] font-semibold text-white">
              무료로 시작하기
            </Link>
            <Link href="/home" className="flex h-[52px] w-full items-center justify-center rounded-xl border border-gray-30 text-[15px] font-semibold text-gray-70">
              서비스 둘러보기
            </Link>
          </div>
          <div className="flex items-center gap-5 text-[12px] text-gray-50">
            <span>✓ 무료</span>
            <span>✓ 회원가입 1분</span>
            <span>✓ 다국적 통화</span>
          </div>
        </section>

        {/* ③ Features */}
        <section id="features" className="bg-gray-5 py-12 px-5">
          <div className="mb-8 text-center">
            <h2 className="text-[26px] font-bold leading-[1.3] tracking-[-0.52px] text-gray-90">
              여행 지출 관리,<br />이제 쉽고 스마트하게
            </h2>
            <p className="mt-2 text-[13px] leading-[1.7] text-gray-60">
              트리피의 핵심 기능으로 더 즐거운 여행을 만들어보세요
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {[
              { emoji: "💳", title: "간편한 지출 등록", desc: "6가지 카테고리로 빠르게 기록. 카드/현금 결제도 구분 가능해요.", bg: "bg-green-0", accent: "text-green-60", tag: "bg-green-10 text-green-70", tagText: "지출 관리" },
              { emoji: "📊", title: "실시간 예산 관리", desc: "여행 예산 대비 현재 지출을 한눈에. 예산 초과 걱정 없이 여행하세요.", bg: "bg-info-5", accent: "text-info-50", tag: "bg-info-5 text-info-50", tagText: "예산 추적" },
              { emoji: "🌍", title: "다국적 통화 지원", desc: "JPY, USD, EUR 등 다양한 통화 지원. 해외여행도 완벽하게.", bg: "bg-green-0", accent: "text-green-60", tag: "bg-green-10 text-green-70", tagText: "해외여행" },
            ].map((item) => (
              <div key={item.title} className={`flex flex-col gap-3 rounded-2xl ${item.bg} p-5`}>
                <span className="text-[32px]">{item.emoji}</span>
                <span className={`self-start rounded-full px-2.5 py-0.5 text-[11px] font-bold ${item.tag}`}>{item.tagText}</span>
                <h3 className={`text-[16px] font-bold ${item.accent}`}>{item.title}</h3>
                <p className="text-[13px] leading-[1.7] text-gray-60">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ④ How it works */}
        <section id="how" className="py-12 px-5">
          <div className="mb-8 text-center">
            <h2 className="text-[26px] font-bold leading-[1.3] tracking-[-0.52px] text-gray-90">
              3단계로 시작하는<br />나만의 여행 가계부
            </h2>
          </div>
          <div className="flex flex-col gap-3">
            {[
              { step: "01", title: "여행 설정", desc: "목적지 국가와 여행 날짜를 입력하세요. 국내외 어디든 설정할 수 있어요.", icon: "🗺️" },
              { step: "02", title: "예산 입력", desc: "여행 총 예산을 설정하세요. 통화 단위도 자유롭게 선택 가능해요.", icon: "💰" },
              { step: "03", title: "지출 기록", desc: "매일 쓴 돈을 카테고리별로 기록하면 자동으로 통계가 만들어져요.", icon: "📝" },
            ].map((item) => (
              <div key={item.step} className="flex flex-col gap-3 rounded-2xl border border-gray-20 bg-white p-5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold tracking-widest text-green-50">STEP {item.step}</span>
                  <span className="text-[28px]">{item.icon}</span>
                </div>
                <h3 className="text-[17px] font-bold text-gray-90">{item.title}</h3>
                <p className="text-[13px] leading-[1.7] text-gray-60">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ⑤ Preview — 카테고리 */}
        <section id="preview" className="bg-gray-5 py-12 px-5">
          <div className="mb-6 text-center">
            <span className="inline-flex rounded-full bg-green-10 px-4 py-1.5 text-[12px] font-semibold text-green-60">카테고리 분석</span>
            <h2 className="mt-3 text-[24px] font-bold leading-[1.3] text-gray-90">
              어디에 얼마 썼는지<br />한눈에 보여요
            </h2>
            <p className="mt-2 text-[13px] leading-[1.7] text-gray-60">
              6가지 카테고리로 지출을 분류하고<br />나의 소비 패턴을 파악해보세요.
            </p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-[0px_4px_24px_rgba(0,0,0,0.06)]">
            <p className="mb-4 text-[13px] font-bold text-gray-90">카테고리 내역 순위</p>
            <div className="flex flex-col gap-3">
              {[
                { rank: 1, label: "숙소", emoji: "🏨", amount: "320,000", width: "w-full", color: "bg-green-50" },
                { rank: 2, label: "식비", emoji: "🍜", amount: "180,000", width: "w-[56%]", color: "bg-green-40" },
                { rank: 3, label: "교통", emoji: "🚌", amount: "95,000", width: "w-[30%]", color: "bg-green-30" },
                { rank: 4, label: "쇼핑", emoji: "🛍️", amount: "55,000", width: "w-[17%]", color: "bg-green-20" },
                { rank: 5, label: "액티비티", emoji: "🎡", amount: "25,000", width: "w-[8%]", color: "bg-green-10" },
              ].map((item) => (
                <div key={item.rank} className="flex items-center gap-3">
                  <span className="w-4 text-center text-[11px] font-bold text-gray-40">{item.rank}</span>
                  <span className="text-[16px]">{item.emoji}</span>
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="flex justify-between">
                      <span className="text-[12px] font-medium text-gray-90">{item.label}</span>
                      <span className="text-[12px] font-semibold text-gray-80">{item.amount}원</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-10">
                      <div className={`h-full ${item.width} ${item.color} rounded-full`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ⑤-2 Preview — 예산 관리 */}
        <section className="py-12 px-5">
          <div className="mb-6 text-center">
            <span className="inline-flex rounded-full bg-info-5 px-4 py-1.5 text-[12px] font-semibold text-info-50">예산 관리</span>
            <h2 className="mt-3 text-[24px] font-bold leading-[1.3] text-gray-90">
              예산 초과 걱정 없이<br />여행하세요
            </h2>
            <p className="mt-2 text-[13px] leading-[1.7] text-gray-60">
              실시간으로 남은 예산을 확인하고<br />과소비 없는 스마트한 여행을 즐기세요.
            </p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-[0px_4px_24px_rgba(0,0,0,0.06)]">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[13px] font-bold text-gray-90">일본 여행 🇯🇵</p>
              <span className="rounded-full bg-info-5 px-2.5 py-0.5 text-[11px] font-bold text-info-50">진행중</span>
            </div>
            <div className="mb-4 flex justify-between">
              <div>
                <p className="text-[11px] text-gray-50">총 지출</p>
                <p className="text-[22px] font-bold text-gray-90">650,000<span className="text-[12px] font-normal text-gray-50">원</span></p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-gray-50">총 예산</p>
                <p className="text-[22px] font-bold text-gray-90">1,000,000<span className="text-[12px] font-normal text-gray-50">원</span></p>
              </div>
            </div>
            <div className="mb-1.5 h-2 w-full overflow-hidden rounded-full bg-gray-10">
              <div className="h-full w-[65%] rounded-full bg-green-50" />
            </div>
            <div className="flex justify-between text-[11px] text-gray-50">
              <span>65% 사용</span>
              <span>남은 예산 350,000원</span>
            </div>
          </div>
        </section>

        {/* ⑥ CTA Banner */}
        <section className="bg-green-50 py-14 px-5">
          <div className="flex flex-col items-center gap-5 text-center">
            <h2 className="text-[26px] font-bold leading-[1.3] text-white">
              다음 여행, 트리피와 함께<br />더 스마트하게 떠나세요
            </h2>
            <p className="text-[13px] leading-[1.7] text-green-10">
              지금 바로 무료로 시작하세요.<br />가입 후 5분이면 첫 여행을 설정할 수 있어요.
            </p>
            <Link href="/" className="flex h-[52px] w-full items-center justify-center rounded-xl bg-white text-[15px] font-bold text-green-60">
              무료로 시작하기 →
            </Link>
            <div className="flex items-center gap-5 text-[12px] text-green-20">
              <span>✓ 완전 무료</span>
              <span>✓ 광고 없음</span>
              <span>✓ 언제든 탈퇴</span>
            </div>
          </div>
        </section>

        {/* ⑦ Footer */}
        <footer className="border-t border-gray-20 bg-white px-5 py-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <Image src="/tripy-logo.svg" alt="트리피" width={72} height={24} />
            <p className="text-[12px] text-gray-50">© 2024 Tripy. 여행의 모든 지출을 스마트하게.</p>
            <div className="flex gap-5 text-[12px] text-gray-50">
              <a href="https://tulip-homegrown-8f7.notion.site/36de275303578051ae43da64326a72be" target="_blank" rel="noopener noreferrer" className="hover:text-gray-80">개인정보처리방침</a>
              <Link href="/mypage/settings" className="hover:text-gray-80">이용약관</Link>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
