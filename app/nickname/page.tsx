"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/ui/Header";
import BottomCTA from "@/components/ui/BottomCTA";
import Input from "@/components/ui/Input";

type CheckStatus = "idle" | "available" | "taken" | "invalid";

export default function NicknamePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [nickname, setNickname] = useState("");
  const [checkStatus, setCheckStatus] = useState<CheckStatus>("idle");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.replace("/");
  }, [authLoading, user, router]);

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
        .upsert({ id: user.id, display_name: nickname }, { onConflict: "id" });
      router.replace("/setup");
    } finally {
      setLoading(false);
    }
  };

  const inputVariant =
    checkStatus === "available"
      ? "success"
      : checkStatus === "taken" || checkStatus === "invalid"
        ? "error"
        : nickname.length > 0
          ? "focused"
          : "default";

  const helperText =
    checkStatus === "available"
      ? "사용가능한 닉네임입니다."
      : checkStatus === "taken"
        ? "이미 사용 중인 닉네임이에요."
        : checkStatus === "invalid"
          ? "숫자, 한글, 영문만 가능하고 3~10자이어야 해요."
          : undefined;

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
      <div className="mt-16 flex items-start gap-2 px-4">
        <div className="flex-1">
          <Input
            value={nickname}
            onChange={(value) => {
              setNickname(value);
              setCheckStatus("idle");
            }}
            placeholder="최대 10자 입력해 주세요."
            maxLength={10}
            variant={inputVariant}
            helperText={helperText}
            icon={
              nickname.length > 0 ? (
                <button
                  type="button"
                  onClick={() => {
                    setNickname("");
                    setCheckStatus("idle");
                  }}
                  className="ml-2 shrink-0"
                  aria-label="닉네임 지우기"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="8" fill="var(--color-gray-40)" />
                    <path
                      d="M5 5L11 11M11 5L5 11"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              ) : null
            }
          />
        </div>
        <button
          onClick={handleCheck}
          disabled={nickname.length === 0}
          className="flex h-12 w-[88px] shrink-0 items-center justify-center rounded-xl bg-green-50 text-base font-bold text-white disabled:opacity-50"
        >
          중복확인
        </button>
      </div>

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
