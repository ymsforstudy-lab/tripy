import Image from "next/image";

export default function TripyImage() {
  return (
    <div className="relative h-[82px] w-20 overflow-hidden">
      <Image
        src="/tripy-character.png"
        alt="트리피 마스코트"
        width={136}
        height={154}
        className="absolute max-w-none -left-[33.52%] -top-[25.71%]"
        style={{ width: "170.05%", height: "187.17%" }}
      />
    </div>
  );
}
