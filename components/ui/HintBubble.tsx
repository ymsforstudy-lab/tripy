interface HintBubbleProps {
  text?: string;
}

export default function HintBubble({
  text = "경비를 등록해 볼까요?",
}: HintBubbleProps) {
  return (
    <div className="relative inline-flex items-center">
      <div className="flex items-center justify-center rounded-[8px] bg-info-5 px-[10px] py-[5px]">
        <p className="whitespace-nowrap text-[12px] leading-[1.5] text-info-50">
          {text}
        </p>
      </div>
      <svg
        className="absolute -right-[5px] top-1/2 -translate-y-1/2"
        width="6"
        height="8"
        viewBox="0 0 6 8"
        fill="none"
      >
        <path d="M0 0L6 4L0 8V0Z" fill="var(--color-info-5)" />
      </svg>
    </div>
  );
}
