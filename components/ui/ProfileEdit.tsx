"use client";

interface ProfileEditProps {
  onClick?: () => void;
}

export default function ProfileEdit({ onClick }: ProfileEditProps) {
  return (
    <div className="relative size-20">
      {/* 프로필 원형 배경 */}
      <div className="flex size-20 items-center justify-center rounded-full bg-green-10">
        <img
          src="/icons/profile-avatar.svg"
          alt="profile character"
          className="h-[43px] w-[48px] object-contain"
        />
      </div>

      {/* 편집 버튼 */}
      <button
        onClick={onClick}
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
    </div>
  );
}
