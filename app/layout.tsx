import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tripy",
  description: "여행용 가계부",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <div className="mx-auto min-h-screen w-full max-w-[390px] bg-white">
          {children}
        </div>
      </body>
    </html>
  );
}
