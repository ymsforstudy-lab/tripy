import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { TripProvider } from "@/contexts/TripContext";

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
        <AuthProvider>
          <TripProvider>
            <div className="mx-auto min-h-screen w-full max-w-[390px] bg-white">
              {children}
            </div>
          </TripProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
