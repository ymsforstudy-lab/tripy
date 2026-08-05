interface ProfileAvatarProps {
  size?: number;
  onClick?: () => void;
  className?: string;
  avatarUrl?: string | null;
}

const AVATAR_IMG = "/icons/profile-avatar.svg";

export default function ProfileAvatar({
  size = 48,
  onClick,
  className = "",
  avatarUrl,
}: ProfileAvatarProps) {
  return (
    <div
      onClick={onClick}
      style={{ width: size, height: size }}
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-green-10 ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="프로필 사진"
          className="size-full object-cover"
        />
      ) : (
        <img
          src={AVATAR_IMG}
          alt="profile character"
          className="object-contain"
          style={{ width: size * 0.6, height: size * 0.54 }}
        />
      )}
    </div>
  );
}
