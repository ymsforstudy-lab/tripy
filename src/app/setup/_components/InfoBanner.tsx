import Image from "next/image";

interface InfoBannerProps {
  text: string;
  className?: string;
}

export default function InfoBanner({ text, className = "" }: InfoBannerProps) {
  return (
    <div className={`flex h-10 items-center justify-center gap-2 rounded-8 bg-status-info-subtle p-2 ${className}`}>
      <Image src="/icons/setup/alert-info.svg" alt="" width={16} height={16} unoptimized />
      <p className="text-body-s text-text-info">{text}</p>
    </div>
  );
}
