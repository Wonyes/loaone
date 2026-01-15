import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import { Header } from "@/components/common/Header";

export const metadata: Metadata = {
  title: "LoaOne",
  description: "LostArk Utility",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 p-4">
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
