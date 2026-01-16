import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import { Header } from "@/components/common/Header";
import { GlobalNotice } from "@/components/common/GlobalNotice";

export const metadata: Metadata = {
  title: "LOAONE",
  description: "LostArk Utility",
  icons: {
    icon: "/assets/logo.png",
    apple: "/assets/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="relative min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 p-4">
        <GlobalNotice />
        <Providers>
          <div className="mx-auto w-full max-w-[1400px] sm:px-6 lg:px-8">
            <Header />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
