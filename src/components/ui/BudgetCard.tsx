import TripyImage from "@/components/ui/TripyImage";
import BudgetProgressBar from "@/components/ui/BudgetProgressBar";
import { getCurrencyUnit } from "@/lib/constants/currency";

interface BudgetCardProps {
  tripName: string;
  tripDateStr: string;
  nightsLabel: string;
  /** 오늘 날짜 지출 합계 (여행 기준 통화) */
  todaySpent: number;
  /** 총예산 − 전체 지출 (여행 기준 통화) */
  remaining: number;
  /** 여행 총예산 */
  totalBudget: number;
  /** totalSpent / totalBudget */
  progressRatio: number;
  currency?: string;
}

function formatAmount(amount: number) {
  return amount.toLocaleString("ko-KR");
}

export default function BudgetCard({
  tripName,
  tripDateStr,
  nightsLabel,
  todaySpent,
  remaining,
  totalBudget,
  progressRatio,
  currency,
}: BudgetCardProps) {
  const isOver = progressRatio > 1;
  const unit = getCurrencyUnit(currency);
  const pct = Math.min(Math.round(progressRatio * 100), 999);

  return (
    <div className="relative z-0 w-full px-4">
      {/* 여행 정보 + 트리피 캐릭터 */}
      <div className="relative flex h-[82px] items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="text-title-m font-bold leading-default text-green-70">{tripName}</span>
          <div className="flex items-center gap-1 text-body-s leading-default text-gray-50">
            {tripDateStr && <span>{tripDateStr}</span>}
            {tripDateStr && nightsLabel && (
              <span aria-hidden className="inline-block size-0.5 rounded-full bg-gray-50" />
            )}
            {nightsLabel && <span>{nightsLabel}</span>}
          </div>
        </div>
        <TripyImage />
      </div>

      {/* 예산 카드 */}
      <div className="rounded-20 border border-green-20 bg-green-10 p-4">
        <div className="flex flex-col gap-3">
          {/* 오늘 쓴 돈 | 남은 금액 */}
          <div className="flex gap-1 items-center">
            <div className="flex flex-1 flex-col gap-1.5">
              <span className="text-body-m leading-default text-gray-80">오늘 쓴 돈</span>
              <div className="flex items-baseline gap-0.5 font-bold">
                <span className="text-title-m text-gray-black">{formatAmount(todaySpent)}</span>
                <span className="text-body-m font-bold leading-default text-gray-black">{unit}</span>
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-1.5">
              <span className="text-body-m leading-default text-gray-80">남은 금액</span>
              <div className="flex items-baseline gap-0.5 font-bold">
                {isOver ? (
                  <span className="text-title-m text-danger-50">예산 초과</span>
                ) : (
                  <>
                    <span className="text-title-m text-gray-90">{formatAmount(remaining)}</span>
                    <span className="text-body-m font-bold leading-default text-gray-90">{unit}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* 예산 요약 + 진행바 */}
          <div className="flex w-full flex-col items-center justify-center rounded-12 bg-gray-white px-3.5 py-3">
            {totalBudget > 0 ? (
              <div className="flex w-full max-w-[285px] flex-col gap-2">
                <div className="flex items-center justify-between text-body-s leading-default">
                  <span className="whitespace-nowrap text-gray-80">
                    총 예산 {formatAmount(totalBudget)}{unit}
                  </span>
                  <div className="flex items-center gap-0.5">
                    <span className={`font-bold ${isOver ? "text-danger-50" : "text-green-60"}`}>
                      {pct}%
                    </span>
                    <span className="text-gray-80">소비했어요!</span>
                  </div>
                </div>
                <BudgetProgressBar ratio={progressRatio} />
              </div>
            ) : (
              <div className="flex w-full flex-col gap-0.5">
                <span className="text-body-s font-medium text-gray-70">등록된 예산이 없어요.</span>
                <span className="text-body-s text-gray-50">예산을 등록하면 소비 비율을 확인할 수 있어요.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
