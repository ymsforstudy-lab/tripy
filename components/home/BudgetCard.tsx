import TripyImage from "@/components/home/TripyImage";

interface BudgetCardProps {
  todayTotal: number;
  dailyBudget: number;
  progressRatio: number;
}

function formatAmount(amount: number) {
  return amount.toLocaleString("ko-KR");
}

export default function BudgetCard({
  todayTotal,
  dailyBudget,
  progressRatio,
}: BudgetCardProps) {
  return (
    <div className="relative z-0 w-full px-4">
      <div className="relative flex h-[82px] items-center justify-between">
        <h1 className="text-[20px] font-bold leading-[1.5] text-[#396907]">
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
                  {formatAmount(todayTotal)}
                </span>
                <span className="text-[14px] font-bold leading-[1.5] text-black">원</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-[14px] leading-[1.5]">
              <span className="text-gray-80">하루 예산</span>
              <div className="flex gap-0.5 text-gray-60">
                <span>{formatAmount(dailyBudget)}</span>
                <span>원</span>
              </div>
            </div>
          </div>

          <div className="flex h-16 w-full flex-col items-center justify-center rounded-xl bg-white px-3.5">
            <div className="flex w-full max-w-[285px] flex-col gap-2">
              {todayTotal === 0 ? (
                <>
                  <span className="whitespace-nowrap text-[12px] leading-[1.5] text-gray-80">
                    여행 소비를 계획해보세요.
                  </span>
                  <div className="h-[10px] w-full rounded-[20px] bg-gray-30" />
                </>
              ) : (
                <>
                  <div className="flex items-center gap-1.5 leading-[1.5]">
                    <span className="rounded bg-green-0 px-2 py-[2px] text-[10px] font-bold text-green-50">
                      Good
                    </span>
                    <span className="text-[12px] text-gray-80">
                      여행 소비 아주 훌륭한데요?
                    </span>
                  </div>
                  <div className="relative h-[10px] w-full rounded-[20px] bg-gray-30 overflow-hidden">
                    <div
                      className="h-full rounded-[20px]"
                      style={{
                        width: `${progressRatio * 100}%`,
                        background:
                          "linear-gradient(90deg, rgba(255,255,255,0.3) 0%, rgba(33,99,28,0.3) 100%), linear-gradient(90deg, #6BC20F 0%, #6BC20F 100%)",
                      }}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
