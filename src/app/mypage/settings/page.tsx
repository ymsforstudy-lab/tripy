"use client";

import { useRouter } from "next/navigation";
import Header from "@/components/ui/Header";

const PRIVACY_POLICY_URL =
  "https://tulip-homegrown-8f7.notion.site/36de275303578051ae43da64326a72be";

const SECTION_1 = [
  { label: "공지사항" },
  { label: "이용안내" },
];

const SECTION_2 = [
  { label: "이용 약관", href: null },
  { label: "개인정보 처리방침", href: PRIVACY_POLICY_URL },
  { label: "피드백 남기기", href: null },
  { label: "트리피 메일 문의", href: null },
  { label: "탈퇴하기", href: "/mypage/delete-account" },
];

export default function SettingsPage() {
  const router = useRouter();

  return (
    <div className="relative flex min-h-screen flex-col bg-white">
      <Header title="설정" onBack={() => router.back()} />

      <div className="flex flex-col">
        {SECTION_1.map((item) => (
          <button
            key={item.label}
            type="button"
            className="flex w-full items-center p-4 text-left text-[14px] font-medium leading-[1.5] text-black"
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-7 h-2 border-t border-gray-30 bg-gray-10" />

      <div className="mt-7 flex flex-col">
        {SECTION_2.map((item) =>
          item.href?.startsWith("http") ? (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center px-4 py-3 text-left text-[14px] font-medium leading-[1.5] text-gray-70"
            >
              {item.label}
            </a>
          ) : item.href ? (
            <button
              key={item.label}
              type="button"
              onClick={() => router.push(item.href!)}
              className="flex w-full items-center px-4 py-3 text-left text-[14px] font-medium leading-[1.5] text-gray-70"
            >
              {item.label}
            </button>
          ) : (
            <button
              key={item.label}
              type="button"
              className="flex w-full items-center px-4 py-3 text-left text-[14px] font-medium leading-[1.5] text-gray-70"
            >
              {item.label}
            </button>
          )
        )}
      </div>
    </div>
  );
}
