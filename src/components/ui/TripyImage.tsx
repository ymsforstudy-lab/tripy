export default function TripyImage() {
  return (
    <div className="relative h-[82px] w-20">
      <div
        className="absolute pointer-events-none overflow-hidden"
        style={{
          width: "141.546px",
          height: "153.144px",
          left: "50%",
          top: "calc(50% + 9.44px)",
          transform: "translate(-50%, -50%)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/tripy/tripy-7.png"
          alt="트리피 마스코트"
          className="absolute max-w-none"
          style={{
            width: "96.11%",
            height: "100.22%",
            left: "1.66%",
            top: "-0.22%",
          }}
        />
      </div>
    </div>
  );
}
