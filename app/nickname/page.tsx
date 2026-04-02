"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";
import Header from "@/components/layout/Header";
import BottomCTA from "@/components/ui/BottomCTA";

type CheckStatus = "idle" | "available" | "taken" | "invalid";

export default function NicknamePage() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [checkStatus, setCheckStatus] = useState<CheckStatus>("idle");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.replace("/");
    });
  }, [router]);

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
    if (checkStatus !== "available") return;
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      await supabase
        .from("users")
        .update({ display_name: nickname })
        .eq("id", user.id);
      router.replace("/setup");
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
      <Header onBack={() => router.back()} />

      {/* 타이틀 */}
      <div className="px-4 pt-5">
        <h1 className="text-2xl font-bold leading-[1.5] tracking-[-0.48px] text-gray-90">
          닉네임을<br />입력해 주세요
        </h1>
      </div>

      {/* 입력 영역 */}
      <div className="mt-16 flex gap-2 px-4">
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

      {/* 상태 메시지 */}
      {checkStatus !== "idle" && (
        <p
          className={`mt-1 px-4 text-xs tracking-[-0.24px] ${
            checkStatus === "available" ? "text-green-50" : "text-danger-50"
          }`}
        >
          {checkStatus === "available" && "사용가능한 닉네임입니다."}
          {checkStatus === "taken" && "이미 사용 중인 닉네임이에요."}
          {checkStatus === "invalid" && "숫자, 한글, 영문만 가능하고 3~10자이어야 해요."}
        </p>
      )}

      {/* 하단 CTA */}
      <div className="mt-auto">
        <BottomCTA
          label="다음"
          onClick={handleComplete}
          disabled={checkStatus !== "available" || loading}
        />
      </div>
    </div>
  );
}
