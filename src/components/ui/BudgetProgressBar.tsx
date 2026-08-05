interface BudgetProgressBarProps {
  ratio: number;
  className?: string;
}

const GOOD_FILL_STYLE = {
  background:
    "linear-gradient(90deg, rgba(255,255,255,0.3) 0%, rgba(33,99,28,0.3) 100%), linear-gradient(90deg, var(--color-green-50) 0%, var(--color-green-50) 100%)",
};

const DANGER_FILL_STYLE = {
  background:
    "linear-gradient(90deg, rgba(255,255,255,0.3) 0%, rgba(221,46,68,0.3) 100%), linear-gradient(90deg, var(--color-danger-80) 0%, var(--color-danger-80) 100%)",
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
