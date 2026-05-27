"use client";

import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";

const SECTION_1 = [
  { label: "공지사항" },
  { label: "이용안내" },
];

const SECTION_2 = [
  { label: "이용 약관" },
  { label: "개인정보 처리방침" },
  { label: "피드백 남기기" },
  { label: "트리피 메일 문의" },
  { label: "탈퇴하기" },
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
        {SECTION_2.map((item) => (
          <button
            key={item.label}
            type="button"
            className="flex w-full items-center px-4 py-3 text-left text-[14px] font-medium leading-[1.5] text-gray-70"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
