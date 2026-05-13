import Link from "next/link";
import HintBubble from "./HintBubble";

interface FABProps {
  href: string;
  tooltipText?: string;
}

export default function FAB({ href, tooltipText }: FABProps) {
  return (
    <div className="pointer-events-none fixed bottom-[116px] left-1/2 z-40 w-full max-w-[375px] -translate-x-1/2 px-4">
      <div className="flex w-full justify-end">
        <div className="pointer-events-auto flex items-center gap-2">
          {tooltipText && <HintBubble text={tooltipText} />}
          <Link
            href={href}
            className="flex size-11 shrink-0 items-center justify-center rounded-full border border-green-40 bg-green-50 shadow-md"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 5V19M5 12H19"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
