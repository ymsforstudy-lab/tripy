export default function TripyImage() {
  return (
    <div className="relative h-[82px] w-20 overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/tripy/tripy-7.png"
        alt="트리피 마스코트"
        className="absolute max-w-none pointer-events-none"
        style={{
          width: "177.5%",
          height: "187.8%",
          left: "-38.75%",
          top: "-43.9%",
        }}
      />
    </div>
  );
}
