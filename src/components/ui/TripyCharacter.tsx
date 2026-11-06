"use client";

export type TripyCharacterVariant = 1 | 2 | 3 | 4 | 5 | 6 | 7;

interface TripyCharacterProps {
  variant: TripyCharacterVariant;
  className?: string;
}

// PNG는 이미 잘린 크기(180×220, 7번은 80×82)로 내보내져 있다.
// 위치·크기를 %로 늘리면 비율이 깨지므로 object-fit으로만 맞춘다.
const VARIANT_CONFIG: Record<
  TripyCharacterVariant,
  {
    containerW: number;
    containerH: number;
    objectFit?: string;
  }
> = {
  1: {
    containerW: 180,
    containerH: 220,
  },
  2: {
    containerW: 163,
    containerH: 203,
    objectFit: "object-cover",
  },
  3: {
    containerW: 120,
    containerH: 198,
  },
  4: {
    containerW: 142,
    containerH: 198,
  },
  5: {
    containerW: 138,
    containerH: 143,
    // 위쪽(얼굴·차트)을 남기고 아래를 자른다
    objectFit: "object-cover object-top",
  },
  6: {
    containerW: 180,
    containerH: 220,
  },
  7: {
    containerW: 142,
    containerH: 154,
  },
};

export default function TripyCharacter({
  variant,
  className = "",
}: TripyCharacterProps) {
  const config = VARIANT_CONFIG[variant];

  return (
    <div
      className={`relative ${className}`}
      style={{ width: config.containerW, height: config.containerH }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/images/tripy/tripy-${variant}.png`}
        alt="트리피 캐릭터"
        className={`absolute inset-0 h-full w-full pointer-events-none ${config.objectFit ?? "object-contain"}`}
      />
    </div>
  );
}
