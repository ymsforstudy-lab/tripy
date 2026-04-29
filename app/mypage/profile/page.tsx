"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import Header from "@/components/layout/Header";
import BottomCTA from "@/components/ui/BottomCTA";

type CheckStatus = "idle" | "available" | "taken" | "invalid" | "unchanged";

export default function ProfileEditPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [originalNickname, setOriginalNickname] = useState("");
  const [nickname, setNickname] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [checkStatus, setCheckStatus] = useState<CheckStatus>("idle");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      setUserId(user.id);

      const { data: profile } = await supabase
        .from("users")
        .select("display_name, avatar_url")
        .eq("id", user.id)
        .single();

      if (profile?.display_name) {
        setOriginalNickname(profile.display_name);
        setNickname(profile.display_name);
      }
      if (profile?.avatar_url) {
        setAvatarUrl(profile.avatar_url);
      }
    }
    loadProfile();
  }, []);

  const isValidNickname = (value: string) =>
    /^[가-힣a-zA-Z0-9]{3,10}$/.test(value);

  const handleCheck = async () => {
    if (!isValidNickname(nickname)) {
      setCheckStatus("invalid");
      return;
    }
    if (nickname === originalNickname) {
      setCheckStatus("unchanged");
      return;
    }
    const { data } = await supabase
      .from("users")
      .select("id")
      .eq("display_name", nickname)
      .maybeSingle();
    setCheckStatus(data ? "taken" : "available");
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("이미지 크기는 5MB 이하만 가능해요.");
      return;
    }

    setAvatarFile(file);
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
  };

  const canComplete =
    checkStatus === "available" ||
    checkStatus === "unchanged" ||
    (checkStatus === "idle" && avatarFile !== null && nickname === originalNickname);

  const handleComplete = async () => {
    if (!canComplete || !userId) return;
    setLoading(true);
    try {
      const updates: Record<string, string> = {};

      // 닉네임 변경
      if (checkStatus === "available" && nickname !== originalNickname) {
        updates.display_name = nickname;
      }

      // 아바타 업로드
      if (avatarFile) {
        const ext = avatarFile.name.split(".").pop() ?? "jpg";
        const filePath = `${userId}/avatar.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, avatarFile, { upsert: true });

        if (!uploadError) {
          const {
            data: { publicUrl },
          } = supabase.storage.from("avatars").getPublicUrl(filePath);
          updates.avatar_url = `${publicUrl}?t=${Date.now()}`;
        }
      }

      if (Object.keys(updates).length > 0) {
        await supabase.from("users").update(updates).eq("id", userId);
      }

      router.push("/mypage");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const displayAvatar = avatarPreview ?? avatarUrl;

  const inputBorderClass =
    checkStatus === "available" || checkStatus === "unchanged"
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
        <div className="relative size-20">
          <div
            className="flex size-20 items-center justify-center overflow-hidden rounded-full bg-green-10 cursor-pointer"
            onClick={handleAvatarClick}
          >
            {displayAvatar ? (
              <img
                src={displayAvatar}
                alt="프로필 사진"
                className="size-full object-cover"
              />
            ) : (
              <img
                src="/icons/profile-avatar.svg"
                alt="profile character"
                className="h-[43px] w-[48px] object-contain"
              />
            )}
          </div>
          <button
            onClick={handleAvatarClick}
            className="absolute bottom-0 right-0 flex size-6 items-center justify-center rounded-full border border-green-40 bg-green-50"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M6 2.5V9.5M2.5 6H9.5"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
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
              checkStatus === "available" || checkStatus === "unchanged"
                ? "text-green-50"
                : "text-danger-50"
            }`}
          >
            {checkStatus === "available" && "사용가능��� 닉네임입니다."}
            {checkStatus === "unchanged" && "현재 사용 중인 닉네임입니다."}
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
          disabled={!canComplete || loading}
        />
      </div>
    </div>
  );
}
