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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning className="h-full">
      <body className="h-full min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 font-sans text-gray-100 antialiased">
        <Providers>
          <div className="mx-auto w-[1600px]">
            <Header />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
