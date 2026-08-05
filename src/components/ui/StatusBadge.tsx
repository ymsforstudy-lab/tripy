type StatusBadgeVariant = "good" | "danger";

interface StatusBadgeProps {
  variant: StatusBadgeVariant;
  label?: string;
  className?: string;
}

const VARIANT_STYLES: Record<StatusBadgeVariant, { bg: string; text: string; defaultLabel: string }> = {
  good: {
    bg: "bg-green-0",
    text: "text-green-50",
    defaultLabel: "Good",
  },
  danger: {
    bg: "bg-danger-5",
    text: "text-danger-60",
    defaultLabel: "Danger",
  },
};

export default function StatusBadge({ variant, label, className = "" }: StatusBadgeProps) {
  const { bg, text, defaultLabel } = VARIANT_STYLES[variant];
  return (
    <span
      className={`inline-flex items-center justify-center rounded-[8px] px-1 py-[2px] text-[10px] font-bold capitalize leading-[1.5] tracking-[-0.2px] ${bg} ${text} ${className}`}
    >
      {label ?? defaultLabel}
    </span>
  );
}
