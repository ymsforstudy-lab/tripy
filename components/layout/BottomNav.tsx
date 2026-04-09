"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  {
    href: "/travels",
    label: "여행 관리",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M14.5 2.5L17.5 5.5L6.5 16.5H3.5V13.5L14.5 2.5Z"
          stroke={active ? "#FFFFFF" : "#555555"}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3.5 17.5H16.5"
          stroke={active ? "#FFFFFF" : "#555555"}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    href: "/home",
    label: "홈",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M3.5 7.5L10 2L16.5 7.5V17H12.5V12.5H7.5V17H3.5V7.5Z"
          stroke={active ? "#FFFFFF" : "#555555"}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={active ? "white" : "none"}
        />
      </svg>
    ),
  },
  {
    href: "/mypage",
    label: "마이페이지",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="7" r="3.5" stroke={active ? "#FFFFFF" : "#555555"} strokeWidth="1.5" />
        <path
          d="M2.5 17C2.5 14 5.96243 11.5 10 11.5C14.0376 11.5 17.5 14 17.5 17"
          stroke={active ? "#FFFFFF" : "#555555"}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-1/2 w-full max-w-[390px] -translate-x-1/2 border-t border-gray-10 bg-white px-[47px] pb-4 pt-3 shadow-[0px_-2px_4px_0px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between">
        {TABS.map((tab) => {
          const isHome = tab.href === "/home";
          const isActive = pathname === tab.href;

          if (isHome) {
            return (
              <Link key={tab.href} href={tab.href}>
                <div
                  className="flex h-14 w-14 flex-col items-center justify-center gap-0.5 rounded-2xl border border-green-50"
                  style={{
                    background:
                      "linear-gradient(180deg, #6BC20F 0%, rgba(107, 194, 15, 0) 100%), linear-gradient(90deg, #1EB400 0%, #1EB400 100%)",
                  }}
                >
                  {tab.icon(true)}
                  <span className="text-[12px] font-normal leading-[1.5] text-white">
                    {tab.label}
                  </span>
                </div>
              </Link>
            );
          }

          return (
            <Link key={tab.href} href={tab.href}>
              <div className="flex h-[42px] w-14 flex-col items-center justify-start gap-0.5 pt-0.5">
                {tab.icon(isActive)}
                <span
                  className={`text-[12px] font-normal leading-[1.5] ${
                    isActive ? "text-green-70" : "text-gray-70"
                  }`}
                >
                  {tab.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
