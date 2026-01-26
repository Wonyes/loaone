import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "./providers";
import { Header } from "@/components/common/Header";
import { GlobalNotice } from "@/components/common/GlobalNotice";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://loaone.vercel.app"),

  title: {
    default: "로아원 · 로스트아크 정보",
    template: "로아원 · %s",
  },
  description:
    "로스트아크 캘린더, 거래소, 길드, 랭킹 정보를 한눈에! 실시간 이벤트 스케줄과 모험 섬 정보를 확인하세요.",
  keywords: [
    "로아원",
    "로스트아크",
    "LOA",
    "LOSTARK",
    "거래소",
    "길드",
    "랭킹",
    "캘린더",
    "모험 섬",
    "카오스게이트",
    "로아와",
    "클로아",
    "일로아",
    "모코코",
    "로아또",
    "로아",
  ],
  authors: [{ name: "로아원" }],
  creator: "로아원",
  publisher: "로아원",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://loaone.vercel.app",
    title: "로아원 - 로스트아크 종합 정보",
    description: "로스트아크 캘린더, 거래소, 길드, 랭킹 정보를 한눈에!",
    siteName: "로아원",
    images: [
      {
        url: "/og-image-optimized.png",
        width: 1200,
        height: 630,
        alt: "로아원 로고",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "로아원 - 로스트아크 종합 정보",
    description: "로스트아크 캘린더, 거래소, 길드, 랭킹 정보를 한눈에!",
    images: ["/og.image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
    other: [
      {
        rel: "icon",
        url: "/apple-touch-icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
  applicationName: "로아원",
  verification: {
    google: "e_p3eiiAVyD4jMfP98iSE0XIs9Y_nVnNbDQ-6Lsxi0c",
  },
  alternates: {
    canonical: "https://loaone.vercel.app",
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
          <div className="mx-auto w-full max-w-[1400px]">
            <Header />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
