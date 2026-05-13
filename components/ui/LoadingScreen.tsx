"use client";

import Lottie from "lottie-react";
import loddingAnimation from "@/public/lodding.json";

export default function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <Lottie animationData={loddingAnimation} loop={true} className="w-[88px] h-[88px]" />
    </div>
  );
}
