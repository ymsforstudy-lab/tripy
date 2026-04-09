"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// 피그마 inset-[16.66%_8.33%_16.67%_8.38%] → translate(1.676, 3.332)
function ManageIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <g transform="translate(1.676, 3.332)">
        <path
          d="M7.49168 11.6687H16.6583V13.3354H7.49168V11.6687ZM9.40001 0.2437L7.90835 1.7354L11.5833 5.4104L13.075 3.9187C13.3187 3.6854 13.3187 3.3187 13.075 2.7437L10.575 0.2437C10.3417 0.0104 9.97501 0 9.98751 0C9.87837 0 9.77031 0.0215 9.66949 0.0633C9.56868 0.1052 9.47711 0.1665 9.40001 0.2437ZM6.73335 2.9187L0.241681 9.4104C0.164446 9.4882 0.103342 9.5806 0.0618712 9.6821C0.0204007 9.7837 -0.000620149 9.8924 1.39286e-05 10.002V12.502C1.39286e-05 12.9604 0.375014 13.3354 0.833347 13.3354H3.33335C3.55835 13.3354 3.76668 13.2437 3.92501 13.0937L10.4167 6.602L6.74168 2.927L6.73335 2.9187Z"
          fill={color}
        />
      </g>
    </svg>
  );
}

// 피그마 inset-[10%_15%] 14×16 영역 → translate(3, 2) scale(14/18)
function HomeIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <g transform="translate(3, 2) scale(0.7778)">
        <path
          d="M9.55223 0.233927C9.48027 0.159773 9.39481 0.100942 9.30071 0.0608017C9.20662 0.0206614 9.10576 0 9.0039 0C8.90203 0 8.80117 0.0206614 8.70708 0.0608017C8.61299 0.100942 8.52752 0.159773 8.45556 0.233927L2.22557 6.63314C2.15348 6.70789 2.09645 6.79653 2.05775 6.89399C2.01904 6.99145 1.99942 7.0958 2.00001 7.20108V14.4002C2.00001 15.2801 2.70001 16 3.55557 16H5.8889C6.31668 16 6.66668 15.64 6.66668 15.2001V9.60078H11.3333V15.2001C11.3333 15.64 11.6833 16 12.1111 16H14.4444C15.3 16 16 15.2801 16 14.4002V7.20108C16 6.9851 15.9144 6.78513 15.7744 6.63314L9.55223 0.233927Z"
          fill={color}
        />
      </g>
    </svg>
  );
}

// 피그마 inset-[8.33%_12.5%_8.33%_8.33%] → translate(1.666, 1.666)
function MypageIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <g transform="translate(1.666, 1.666)">
        <path
          d="M14.1667 0H2.5C2.04167 0 1.66667 0.375 1.66667 0.833333V4.16667H0V5.83333H1.66667V7.5H0V9.16667H1.66667V10.8333H0V12.5H1.66667V15.8333C1.66667 16.2917 2.04167 16.6667 2.5 16.6667H14.1667C15.0833 16.6667 15.8333 15.9167 15.8333 15V1.66667C15.8333 0.75 15.0833 0 14.1667 0ZM8.75 4.16667C9.94167 4.16667 10.8333 5.05833 10.8333 6.25C10.8333 7.44167 9.94167 8.33333 8.75 8.33333C7.55833 8.33333 6.66667 7.44167 6.66667 6.25C6.66667 5.05833 7.55833 4.16667 8.75 4.16667ZM12.5 12.5H5V11.6667C5 10.2833 6.11667 9.16667 7.5 9.16667H10C11.3833 9.16667 12.5 10.2833 12.5 11.6667V12.5Z"
          fill={color}
        />
      </g>
    </svg>
  );
}

const TABS = [
  {
    href: "/travels",
    label: "여행 관리",
    Icon: ManageIcon,
  },
  {
    href: "/home",
    label: "홈",
    Icon: HomeIcon,
    isHome: true,
  },
  {
    href: "/mypage",
    label: "마이페이지",
    Icon: MypageIcon,
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-1/2 w-full max-w-[375px] -translate-x-1/2 border-t border-gray-10 bg-white px-[47px] pb-4 pt-3 shadow-[0px_-2px_4px_0px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between">
        {TABS.map(({ href, label, Icon, isHome }) => {
          const isActive = pathname === href;

          if (isHome) {
            return (
              <Link key={href} href={href}>
                <div
                  className="flex h-14 w-14 flex-col items-center justify-center gap-0.5 rounded-2xl border border-green-50"
                  style={{
                    background:
                      "linear-gradient(180deg, #6BC20F 0%, rgba(107, 194, 15, 0) 100%), linear-gradient(90deg, #1EB400 0%, #1EB400 100%)",
                  }}
                >
                  <Icon color="#FFFFFF" />
                  <span className="text-[12px] font-normal leading-[1.5] text-white">
                    {label}
                  </span>
                </div>
              </Link>
            );
          }

          const color = isActive ? "#6BC20F" : "#555555";

          return (
            <Link key={href} href={href}>
              <div className="flex h-[42px] w-14 flex-col items-center justify-start gap-0.5 pt-0.5">
                <Icon color={color} />
                <span
                  className={`text-[12px] font-normal leading-[1.5] ${
                    isActive ? "text-green-50" : "text-gray-70"
                  }`}
                >
                  {label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
