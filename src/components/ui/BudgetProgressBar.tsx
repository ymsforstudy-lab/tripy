interface BudgetProgressBarProps {
  ratio: number;
  className?: string;
}

const GOOD_FILL_STYLE = {
  background:
    "var(--gradient-progress-good)",
};

const DANGER_FILL_STYLE = {
  background:
    "var(--gradient-progress-danger)",
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
        className="h-full rounded-[20px] transition-[width] duration-500 ease-out"
        style={{
          width: `${widthPercent}%`,
          background: fillStyle.background,
        }}
      />
    </div>
  );
}
