interface ProfileAvatarProps {
  size?: number;
  onClick?: () => void;
  className?: string;
}

const AVATAR_IMG = "/icons/profile-avatar.svg";

export default function ProfileAvatar({
  size = 48,
  onClick,
  className = "",
}: ProfileAvatarProps) {
  return (
    <div
      onClick={onClick}
      style={{ width: size, height: size }}
      className={`flex shrink-0 items-center justify-center rounded-full bg-green-10 ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      <img
        src={AVATAR_IMG}
        alt="profile character"
        className="object-contain"
        style={{ width: size * 0.6, height: size * 0.54 }}
      />
    </div>
  );
}
