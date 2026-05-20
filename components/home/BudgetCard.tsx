import TripyImage from "@/components/home/TripyImage";
import StatusBadge from "@/components/ui/StatusBadge";
import BudgetProgressBar from "@/components/ui/BudgetProgressBar";
import { getCurrencyUnit } from "@/lib/constants/currency";

interface BudgetCardProps {
  totalSpent: number;
  totalBudget: number;
  progressRatio: number;
  currency?: string;
}

function formatAmount(amount: number) {
  return amount.toLocaleString("ko-KR");
}

export default function BudgetCard({
  totalSpent,
  totalBudget,
  progressRatio,
  currency,
}: BudgetCardProps) {
  const isOver = progressRatio > 1;
  const hasSpending = totalSpent > 0;
  const unit = getCurrencyUnit(currency);

  return (
    <div className="relative z-0 w-full px-4">
      <div className="relative flex h-[82px] items-center justify-between">
        <h1 className="text-[20px] font-bold leading-[1.5] text-green-70">
          오늘 나의 예산
        </h1>
        <div className="absolute right-0 bottom-0 flex items-end">
          <TripyImage />
        </div>
      </div>

      <div className="relative w-full rounded-[20px] border border-green-20 bg-green-10 p-4 shadow-[0_4px_4px_rgba(107,194,15,0.2)]">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-[14px] leading-[1.5] text-gray-80">오늘 쓴 돈</span>
              <div className="flex items-baseline gap-0.5 font-bold">
                <span className="text-[20px] text-black">
                  {formatAmount(totalSpent)}
                </span>
                <span className="text-[14px] font-bold leading-[1.5] text-black">{unit}</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-[14px] leading-[1.5]">
              <span className="text-gray-80">하루 예산</span>
              <div className="flex gap-0.5 text-gray-60">
                <span>{formatAmount(totalBudget)}</span>
                <span>{unit}</span>
              </div>
            </div>
          </div>

          <div className="flex h-16 w-full flex-col items-center justify-center rounded-xl bg-white px-3.5">
            <div className="flex w-full max-w-[285px] flex-col gap-2">
              {!hasSpending ? (
                <>
                  <span className="whitespace-nowrap text-[12px] leading-[1.5] text-gray-80">
                    여행 소비를 계획해보세요.
                  </span>
                  <div className="h-[10px] w-full rounded-[20px] bg-gray-30" />
                </>
              ) : (
                <>
                  <div className="flex items-center gap-1 leading-[1.5]">
                    <StatusBadge variant={isOver ? "danger" : "good"} />
                    <span className="text-[12px] text-gray-80">
                      {isOver
                        ? "지출이 여행 예산보다 초과되었어요!"
                        : "여행 소비 아주 훌륭한데요?"}
                    </span>
                  </div>
                  <BudgetProgressBar ratio={progressRatio} />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
