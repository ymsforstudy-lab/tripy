import Image from "next/image";

export default function HomeHeader() {
  return (
    <header className="flex w-full items-center px-4 pb-4 pt-6">
      <div className="relative h-6 w-[66.843px]">
        <Image src="/tripy-logo.svg" alt="Tripy" fill className="object-contain" />
      </div>
    </header>
  );
}
