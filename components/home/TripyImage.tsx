const FIGMA_TRIPY_IMAGE =
  "http://localhost:3845/assets/b810cf799fd37edcb37b8d45ce213f18c258fae0.png";

export default function TripyImage() {
  return (
    <div className="relative h-[82px] w-20 overflow-hidden">
      <img
        src={FIGMA_TRIPY_IMAGE}
        alt="트리피 마스코트"
        className="absolute h-[187.17%] w-[170.05%] max-w-none -left-[33.52%] -top-[25.71%]"
      />
    </div>
  );
}
