import { CATEGORY_MAP, CategoryId } from "@/lib/constants/categories";

interface CategoryIconProps {
  /** 카테고리 ID (accommodation | food | transport | activity | shopping | etc) */
  category: CategoryId | string;
  /**
   * 렌더 방식
   * - "image" : 피그마 커스텀 일러스트 (기본값)
   * - "emoji" : 텍스트 이모지 fallback
   */
  variant?: "image" | "emoji";
  /** 컨테이너 크기 (px). 기본 24 */
  size?: number;
  className?: string;
}

export default function CategoryIcon({
  category,
  variant = "image",
  size = 24,
  className = "",
}: CategoryIconProps) {
  const found = CATEGORY_MAP[category as CategoryId];

  if (!found) {
    return (
      <span style={{ fontSize: size * 0.7 }} className={className}>
        💰
      </span>
    );
  }

  if (variant === "emoji") {
    return (
      <span
        style={{ fontSize: size * 0.7 }}
        aria-label={found.label}
        className={className}
      >
        {found.emoji}
      </span>
    );
  }

  return (
    <div
      style={{ width: size, height: size }}
      className={`flex shrink-0 items-center justify-center overflow-hidden ${className}`}
      aria-label={found.label}
    >
      <img
        src={found.imgSrc}
        alt={found.label}
        className="size-full object-contain"
      />
    </div>
  );
}
