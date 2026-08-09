import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tripy - 여행용 가계부",
  description: "여행 경비를 쉽고 빠르게 기록하세요",
  openGraph: {
    title: "Tripy - 여행용 가계부",
    description: "여행 경비를 쉽고 빠르게 기록하세요",
    url: "https://tripy-psi.vercel.app/landing",
    siteName: "Tripy",
    images: [
      {
        url: "https://tripy-psi.vercel.app/og-landing.png",
        width: 1200,
        height: 630,
        alt: "Tripy - 여행용 가계부",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tripy - 여행용 가계부",
    description: "여행 경비를 쉽고 빠르게 기록하세요",
    images: ["https://tripy-psi.vercel.app/og-landing.png"],
  },
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
