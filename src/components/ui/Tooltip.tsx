interface TooltipProps {
  label?: string;
}

export default function Tooltip({
  label = "경비를 등록해 볼까요?",
}: TooltipProps) {
  return (
    <div className="relative inline-flex items-center">
      <div className="flex items-center justify-center rounded-8 bg-info-5 px-2.5 py-[5px]">
        <p className="whitespace-nowrap text-body-s leading-default text-info-50">
          {label}
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
