"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";
import BottomCTA from "@/components/ui/BottomCTA";
import ProfileEdit from "@/components/ui/ProfileEdit";

type CheckStatus = "idle" | "available" | "taken" | "invalid";

export default function ProfileEditPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [nickname, setNickname] = useState("드리미");
  const [checkStatus, setCheckStatus] = useState<CheckStatus>("idle");
  const [loading, setLoading] = useState(false);

  const isValidNickname = (value: string) =>
    /^[가-힣a-zA-Z0-9]{3,10}$/.test(value);

  const handleCheck = async () => {
    if (!isValidNickname(nickname)) {
      setCheckStatus("invalid");
      return;
    }
    const { data } = await supabase
      .from("users")
      .select("id")
      .eq("display_name", nickname)
      .maybeSingle();
    setCheckStatus(data ? "taken" : "available");
  };

  const handleComplete = async () => {
    if (checkStatus !== "available" || !user) return;
    setLoading(true);
    try {
      await supabase
        .from("users")
        .update({ display_name: nickname })
        .eq("id", user.id);
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const inputBorderClass =
    checkStatus === "available"
      ? "border-green-50"
      : checkStatus === "taken" || checkStatus === "invalid"
        ? "border-danger-50"
        : nickname.length > 0
          ? "border-gray-60"
          : "border-gray-30";

  return (
    <div className="flex h-screen flex-col bg-white">
      <Header title="프로필 수정" onBack={() => router.back()} />

      {/* 프로필 이미지 */}
      <div className="mt-8 flex justify-center">
        <ProfileEdit />
      </div>

      {/* 닉네임 입력 */}
      <div className="mt-10 flex flex-col gap-1 px-4">
        <div className="flex gap-2">
          <div
            className={`flex flex-1 items-center rounded-xl border bg-gray-5 px-3 py-3 ${inputBorderClass}`}
          >
            <input
              type="text"
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                setCheckStatus("idle");
              }}
              placeholder="최대 10자 입력해 주세요."
              maxLength={10}
              className="flex-1 bg-transparent text-sm font-medium text-gray-90 outline-none placeholder:font-normal placeholder:text-gray-50"
            />
            {nickname.length > 0 && (
              <button
                onClick={() => {
                  setNickname("");
                  setCheckStatus("idle");
                }}
                className="ml-2 shrink-0"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="8" fill="#C6C6C6" />
                  <path
                    d="M5 5L11 11M11 5L5 11"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            )}
          </div>
          <button
            onClick={handleCheck}
            disabled={nickname.length === 0}
            className="flex h-12 w-[88px] shrink-0 items-center justify-center rounded-xl bg-green-50 text-base font-bold text-white disabled:opacity-50"
          >
            중복확인
          </button>
        </div>

        {checkStatus !== "idle" && (
          <p
            className={`text-xs tracking-[-0.24px] ${
              checkStatus === "available" ? "text-green-50" : "text-danger-50"
            }`}
          >
            {checkStatus === "available" && "사용가능한 닉네임입니다."}
            {checkStatus === "taken" && "이미 사용 중인 닉네임이에요."}
            {checkStatus === "invalid" &&
              "숫자, 한글, 영문만 가능하고 3~10자이어야 해요."}
          </p>
        )}
      </div>

      {/* 하단 CTA */}
      <div className="mt-auto">
        <BottomCTA
          label="완료"
          onClick={handleComplete}
          disabled={checkStatus !== "available" || loading}
        />
      </div>
    </div>
  );
}
