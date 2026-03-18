"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";

type CheckStatus = "idle" | "available" | "taken" | "invalid";

export default function NicknamePage() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [checkStatus, setCheckStatus] = useState<CheckStatus>("idle");
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.replace("/");
        return;
      }
      const identities = user.identities;
      if (identities?.[0]?.provider) {
        setProvider(identities[0].provider);
      }
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

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from("users")
      .update({ display_name: nickname })
      .eq("id", user.id);

    router.replace("/home");
  };

  const checkMessage: Record<Exclude<CheckStatus, "idle">, string> = {
    available: "사용 가능한 닉네임이에요.",
    taken: "이미 사용 중인 닉네임이에요.",
    invalid: "숫자, 한글, 영문만 가능하고 3~10자이어야 해요.",
  };

  const checkColor: Record<Exclude<CheckStatus, "idle">, string> = {
    available: "text-green-50",
    taken: "text-danger-50",
    invalid: "text-danger-50",
  };

  return (
    <div className="relative flex h-screen flex-col bg-white">
      {/* 헤더 */}
      <div className="flex items-center gap-4 px-4 pb-4 pt-6">
        <button onClick={() => router.back()} className="shrink-0">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 18L9 12L15 6"
              stroke="#1D1D1D"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <span className="flex-1 text-center text-base font-bold tracking-[-0.32px] text-gray-90">
          닉네임 변경
        </span>
        <div className="size-6 shrink-0" />
      </div>

      {/* 프로필 이미지 */}
      <div className="flex justify-center pt-4">
        <div className="relative">
          <div className="flex size-[100px] items-center justify-center rounded-full bg-green-10">
            <div className="relative size-[79px]">
              <Image
                src="/mascot-profile.svg"
                alt="프로필 이미지"
                fill
                className="object-contain"
              />
            </div>
          </div>
          {/* 카메라 버튼 */}
          <div className="absolute bottom-0 right-0 flex size-6 items-center justify-center rounded-full border border-gray-40 bg-gray-10 shadow-sm">
            <svg width="12" height="11" viewBox="0 0 12 11" fill="none">
              <path
                d="M4.5 1L3.5 2.5H1.5C0.948 2.5 0.5 2.948 0.5 3.5V9C0.5 9.552 0.948 10 1.5 10H10.5C11.052 10 11.5 9.552 11.5 9V3.5C11.5 2.948 11.052 2.5 10.5 2.5H8.5L7.5 1H4.5Z"
                stroke="#555555"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="6" cy="6.25" r="1.75" stroke="#555555" strokeWidth="1" />
            </svg>
          </div>
        </div>
      </div>

      {/* 닉네임 입력 */}
      <div className="mt-[40px] px-4">
        <div className="flex flex-col gap-2">
          {/* 라벨 */}
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium text-black">닉네임</span>
            <span className="text-[#EB003B]">*</span>
          </div>

          {/* 인풋 + 중복확인 버튼 */}
          <div className="flex gap-2">
            <div className="flex flex-1 items-center justify-between rounded-xl border border-green-50 bg-white px-3 py-3">
              <input
                type="text"
                value={nickname}
                onChange={(e) => {
                  setNickname(e.target.value);
                  setCheckStatus("idle");
                }}
                placeholder="닉네임을 입력해주세요"
                maxLength={10}
                className="flex-1 text-sm text-gray-90 outline-none placeholder:text-gray-40"
              />
            </div>
            <button
              onClick={handleCheck}
              className="flex h-12 w-[88px] shrink-0 items-center justify-center rounded-xl bg-green-50 text-base text-white"
            >
              중복확인
            </button>
          </div>

          {/* 상태 메시지 */}
          {checkStatus !== "idle" && (
            <p className={`text-xs ${checkColor[checkStatus]}`}>
              {checkMessage[checkStatus]}
            </p>
          )}

          {/* 규칙 안내 */}
          <ul className="mt-1 flex flex-col gap-1.5 text-xs font-bold text-gray-50">
            <li className="ml-4 list-disc">숫자, 한글, 영문 입력 가능</li>
            <li className="ml-4 list-disc">최소 3자 이상 10자 이내 입력 가능</li>
          </ul>
        </div>
      </div>

      {/* 구분선 */}
      <div className="mt-8 h-2 bg-green-10" />

      {/* 연결 계정 */}
      <div className="mt-5 px-4">
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium text-black">연결 계정</span>
          <span className="text-[#EB003B]">*</span>
        </div>
        <div className="mt-2">
          {provider === "google" && (
            <div className="flex size-10 items-center justify-center rounded-full bg-white shadow-sm border border-gray-20">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M18.1713 8.36816H17.5V8.33333H10V11.6667H14.7096C14.0225 13.607 12.1763 15 10 15C7.23858 15 5 12.7614 5 10C5 7.23858 7.23858 5 10 5C11.2746 5 12.4342 5.48083 13.3171 6.26917L15.6742 3.91208C14.1858 2.52375 12.1946 1.66667 10 1.66667C5.39762 1.66667 1.66667 5.39762 1.66667 10C1.66667 14.6024 5.39762 18.3333 10 18.3333C14.6024 18.3333 18.3333 14.6024 18.3333 10C18.3333 9.44083 18.2758 8.89583 18.1713 8.36816Z" fill="#FFC107"/>
                <path d="M2.62744 6.12125L5.36536 8.12917C6.10619 6.295 7.90036 5 10 5C11.2746 5 12.4342 5.48083 13.3171 6.26917L15.6742 3.91208C14.1858 2.52375 12.1946 1.66667 10 1.66667C6.79911 1.66667 4.02327 3.47375 2.62744 6.12125Z" fill="#FF3D00"/>
                <path d="M10 18.3333C12.1525 18.3333 14.108 17.5096 15.5871 16.1671L13.008 13.9875C12.1431 14.6452 11.0865 15.0008 10 15C7.83257 15 5.99174 13.6179 5.29841 11.6892L2.58008 13.7829C3.95924 16.4817 6.76174 18.3333 10 18.3333Z" fill="#4CAF50"/>
                <path d="M18.1713 8.36816H17.5V8.33333H10V11.6667H14.7096C14.3809 12.5902 13.7889 13.3972 13.0067 13.9879L13.008 13.9871L15.5871 16.1667C15.4046 16.3325 18.3333 14.1667 18.3333 10C18.3333 9.44083 18.2758 8.89583 18.1713 8.36816Z" fill="#1976D2"/>
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* 하단 완료 버튼 */}
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-7">
        <button
          onClick={handleComplete}
          disabled={checkStatus !== "available" || loading}
          className="flex h-14 w-full items-center justify-center rounded-xl bg-green-50 text-base text-white disabled:opacity-40"
        >
          완료
        </button>
      </div>
    </div>
  );
}
