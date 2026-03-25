"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  {
    href: "/travels",
    label: "여행 관리",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M3 5H17M3 10H17M3 15H17"
          stroke={active ? "#6BC20F" : "#555555"}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    href: "/home",
    label: "홈",
    icon: (_active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M3 8.5L10 2L17 8.5V17H13V12H7V17H3V8.5Z"
          fill="white"
          stroke="white"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    href: "/mypage",
    label: "마이페이지",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle
          cx="10"
          cy="7"
          r="3"
          stroke={active ? "#6BC20F" : "#555555"}
          strokeWidth="1.5"
        />
        <path
          d="M3 17C3 13.686 6.134 11 10 11C13.866 11 17 13.686 17 17"
          stroke={active ? "#6BC20F" : "#555555"}
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
    <div className="flex items-center justify-between border-t border-gray-10 bg-white pb-4 pt-3 shadow-[0px_-2px_4px_0px_rgba(0,0,0,0.04)]">
      {NAV_ITEMS.map((item) => {
        const isHome = item.href === "/home";
        const isActive = pathname === item.href;

        if (isHome) {
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-green-50"
              style={{
                background:
                  "linear-gradient(180deg, #6BC20F 0%, rgba(107,194,15,0) 100%), linear-gradient(90deg, #1EB400 0%, #1EB400 100%)",
              }}
            >
              <div className="flex flex-col items-center gap-1">
                {item.icon(true)}
                <span className="text-[10px] font-normal text-white">{item.label}</span>
              </div>
            </Link>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex w-14 flex-col items-center gap-1"
          >
            {item.icon(isActive)}
            <span
              className={`text-xs ${
                isActive ? "text-green-50" : "text-gray-70"
              }`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
