"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import BottomCTA from "@/components/ui/BottomCTA";

export default function SetupPage() {
  const router = useRouter();

  return (
    <div className="flex h-screen flex-col bg-white">
      <div className="flex flex-1 flex-col items-center justify-center gap-5">
        <h1 className="text-center text-2xl font-bold leading-[1.5] tracking-[-0.48px] text-gray-90">
          여행지를<br />등록해 볼까요?
        </h1>
        <div className="relative h-[198px] w-[120px]">
          <Image
            src="/mascot.png"
            alt="트리피 마스코트"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      <BottomCTA label="등록하기" onClick={() => router.push("/setup/country")} />
    </div>
  );
}
