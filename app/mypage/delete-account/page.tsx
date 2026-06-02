"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Header from "@/components/layout/Header";
import { supabase } from "@/lib/supabase";

const REASONS = [
  "앱 사용이 불편해요",
  "자주 사용하지 않아요",
  "개인정보 삭제를 원해요",
  "서비스가 기대에 못 미쳐요",
  "직접입력",
];

const MAX_LENGTH = 100;

export default function DeleteAccountPage() {
  const router = useRouter();
  const [reasonOpen, setReasonOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleDelete() {
    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("expenses").delete().eq("trip_id",
          (await supabase.from("trips").select("id").eq("user_id", user.id)).data?.map(t => t.id) ?? []
        );
        await supabase.from("trips").delete().eq("user_id", user.id);
        await supabase.from("users").delete().eq("id", user.id);
      }
      await supabase.auth.signOut();
      router.push("/");
    } catch {
      alert("탈퇴 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
      setSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-white">
      <Header onBack={() => router.back()} />

      {/* 본문 */}
      <div className="flex flex-col gap-6 px-4 pt-2">
        {/* 타이틀 */}
        <div className="flex flex-col gap-4">
          <div className="py-1">
            <h1 className="text-2xl font-semibold leading-[1.5] text-black">
              떠나신다니 아쉬워요.<br />
              정말 탈퇴하시겠어요?
            </h1>
          </div>
          <p className="text-[14px] leading-[1.5] text-gray-60">
            회원 탈퇴 시 계정 정보 및 이용 내역이 삭제되며,<br />
            삭제된 정보는 복구할 수 없습니다.
          </p>
        </div>

        {/* 폼 */}
        <div className="flex flex-col gap-2">
          {/* 이유 드롭다운 */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setReasonOpen((prev) => !prev)}
              className="flex h-12 w-full items-center justify-between rounded-xl border border-gray-30 bg-white px-4 py-2"
            >
              <span className={`text-[14px] leading-[1.5] ${selectedReason ? "text-gray-90" : "text-gray-60"}`}>
                {selectedReason ?? "떠나시는 이유가 있을까요?"}
              </span>
              <svg
                width="16" height="16" viewBox="0 0 16 16" fill="none"
                className={`shrink-0 transition-transform ${reasonOpen ? "rotate-180" : ""}`}
              >
                <path d="M4 6L8 10L12 6" stroke="var(--color-gray-60)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {reasonOpen && (
              <div className="absolute left-0 top-[52px] z-20 w-full overflow-hidden rounded-xl border border-gray-30 bg-white shadow-md">
                {REASONS.map((reason) => (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => {
                      setSelectedReason(reason);
                      setReasonOpen(false);
                    }}
                    className={`flex w-full items-center px-4 py-3 text-[14px] leading-[1.5] transition-colors hover:bg-gray-5 ${
                      selectedReason === reason ? "bg-gray-5 font-medium text-gray-90" : "text-gray-90"
                    }`}
                  >
                    {reason}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 내용 입력 - 직접입력 선택 시에만 표시 */}
          {selectedReason === "직접입력" && (
            <div className="relative flex h-[98px] w-full flex-col justify-between rounded-xl border border-gray-30 bg-white px-4 pb-2 pt-4">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value.slice(0, MAX_LENGTH))}
                placeholder="내용을 입력해 주세요"
                className="flex-1 resize-none bg-transparent text-[14px] leading-[1.5] text-gray-90 outline-none placeholder:text-gray-50"
              />
              <span className="self-end text-[12px] leading-[1.5] text-gray-50">
                {content.length}/{MAX_LENGTH}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 마스코트 이미지 - Figma 위치 고정 */}
      <div className="absolute top-[58%] h-[220px] w-[180px] pointer-events-none" style={{ left: "calc(50% + 9.06px)" }}>
        <Image
          src="/tripy-delete.png"
          alt="트리피 캐릭터"
          fill
          className="object-contain object-center"
        />
      </div>

      {/* 하단 탈퇴 버튼 */}
      <div className="fixed bottom-0 left-1/2 w-full max-w-[390px] -translate-x-1/2 border-t border-gray-20 bg-white px-4 pb-8 pt-4">
        <button
          type="button"
          onClick={handleDelete}
          disabled={submitting}
          className="flex h-14 w-full items-center justify-center rounded-xl bg-green-50 text-base font-semibold leading-[1.5] text-white disabled:opacity-50"
        >
          {submitting ? "처리 중..." : "탈퇴하기"}
        </button>
      </div>
    </div>
  );
}
