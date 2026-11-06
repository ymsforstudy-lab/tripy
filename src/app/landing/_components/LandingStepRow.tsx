interface LandingStepRowProps {
  /** "01" 형식 */
  step: string;
  title: string;
  description: string;
  className?: string;
}

/** 랜딩 사용 방법 한 줄. 큰 번호 + 제목·설명, 위쪽 가는 구분선 (Figma LandingStepRow) */
export default function LandingStepRow({ step, title, description, className = "" }: LandingStepRowProps) {
  return (
    <div className={`flex gap-4.5 border-t border-gray-10 py-5.5 ${className}`}>
      <span className="w-10 shrink-0 text-headline-l font-semibold tracking-tighter text-green-50">{step}</span>
      <div className="flex flex-col gap-1.5 pt-0.5">
        <h3 className="text-title-m font-semibold tracking-tight text-gray-90">{title}</h3>
        <p className="text-body-m text-gray-60">{description}</p>
      </div>
    </div>
  );
}
