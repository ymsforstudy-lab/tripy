export default function TripyImage() {
  return (
    <div className="relative h-[82px] w-20 overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/tripy/tripy-7.png"
        alt="트리피 마스코트"
        className="absolute max-w-none pointer-events-none"
        style={{
          width: "176.93%",
          height: "186.76%",
          left: "-38.47%",
          top: "-31.86%",
        }}
      />
    </div>
  );
}
