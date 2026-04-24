interface BudgetProgressBarProps {
  ratio: number;
  className?: string;
}

const GOOD_FILL_STYLE = {
  background:
    "linear-gradient(90deg, rgba(255,255,255,0.3) 0%, rgba(33,99,28,0.3) 100%), linear-gradient(90deg, #6BC20F 0%, #6BC20F 100%)",
  borderColor: "rgba(130,204,65,0.4)",
};

const DANGER_FILL_STYLE = {
  background:
    "linear-gradient(90deg, rgba(255,255,255,0.3) 0%, rgba(221,46,68,0.3) 100%), linear-gradient(90deg, #8D0023 0%, #8D0023 100%)",
  borderColor: "#A0041E",
};

export default function BudgetProgressBar({ ratio, className = "" }: BudgetProgressBarProps) {
  const safeRatio = Number.isFinite(ratio) && ratio > 0 ? ratio : 0;
  const isOver = safeRatio > 1;
  const widthPercent = Math.min(safeRatio, 1) * 100;
  const fillStyle = isOver ? DANGER_FILL_STYLE : GOOD_FILL_STYLE;

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(safeRatio * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`relative h-[10px] w-full overflow-hidden rounded-[20px] bg-gray-30 ${className}`}
    >
      <div
        className="h-full rounded-[20px] border transition-[width] duration-500 ease-out"
        style={{
          width: `${widthPercent}%`,
          background: fillStyle.background,
          borderColor: fillStyle.borderColor,
        }}
      />
    </div>
  );
}
