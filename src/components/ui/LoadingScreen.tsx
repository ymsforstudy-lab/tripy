"use client";

import Lottie from "lottie-react";
import loadingAnimation from "@/assets/loading.json";

export default function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <Lottie animationData={loadingAnimation} loop={true} className="w-[88px] h-[88px]" />
    </div>
  );
}
