"use client";

export type TripyCharacterType = 1 | 2 | 3 | 4 | 5 | 6;

interface TripyCharacterProps {
  type: TripyCharacterType;
  className?: string;
}

const TYPE_CONFIG: Record<
  TripyCharacterType,
  {
    containerW: number;
    containerH: number;
    imgStyle?: React.CSSProperties;
    overflow?: boolean;
    objectFit?: string;
  }
> = {
  1: {
    containerW: 180,
    containerH: 220,
    overflow: true,
    imgStyle: { width: "100%", height: "125.69%", top: "-8.28%", left: "0" },
  },
  2: {
    containerW: 163,
    containerH: 203,
    objectFit: "object-cover",
  },
  3: {
    containerW: 120,
    containerH: 198,
    objectFit: "object-contain",
  },
  4: {
    containerW: 142,
    containerH: 198,
    overflow: true,
    imgStyle: {
      width: "105.56%",
      height: "108.73%",
      top: "-3.86%",
      left: "-0.67%",
    },
  },
  5: {
    containerW: 138,
    containerH: 143,
    overflow: true,
    imgStyle: {
      width: "113.04%",
      height: "157.8%",
      top: "-40.85%",
      left: "-6%",
    },
  },
  6: {
    containerW: 138,
    containerH: 198,
    objectFit: "object-bottom object-cover",
  },
};

export default function TripyCharacter({
  type,
  className = "",
}: TripyCharacterProps) {
  const config = TYPE_CONFIG[type];

  if (config.overflow && config.imgStyle) {
    return (
      <div
        className={`relative overflow-hidden ${className}`}
        style={{ width: config.containerW, height: config.containerH }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/character-${type}.png`}
          alt="트리피 캐릭터"
          className="absolute pointer-events-none"
          style={config.imgStyle}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative ${className}`}
      style={{ width: config.containerW, height: config.containerH }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/character-${type}.png`}
        alt="트리피 캐릭터"
        className={`absolute inset-0 h-full w-full pointer-events-none ${config.objectFit ?? "object-contain"}`}
      />
    </div>
  );
}
