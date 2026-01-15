// components/common/Header.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoginButton } from "./LoginButton";
import { CharacterSearch } from "../character/CharacterSearch";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="design-card sticky top-4 z-50 mb-8 flex h-16 w-full items-center rounded-full px-4 backdrop-blur-sm xl:px-6">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            onClick={() => router.push("/")}
            className="relative flex cursor-pointer items-center justify-center py-2"
          >
            <div className="absolute top-1/2 left-1/2 h-8 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/20 blur-xl"></div>
            <img
              src="/assets/logo.png"
              alt="LOAONE Logo"
              className="relative z-14 h-14 w-auto object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
            />
          </div>

          <div className="hidden pl-10 lg:block">
            <nav className="flex items-center gap-6">
             
              <Link href="/market" className="block">
                <span>거래소</span>
              </Link>
              <Link href="/guild" className="block">
                <span>길드</span>
              </Link>
              <Link href="/cunning-paper" className="block">
                <span>컨닝페이퍼</span>
              </Link>
            </nav>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:block">
            <CharacterSearch />
          </div>

          <LoginButton />

          <button
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="absolute top-full right-0 left-0 mt-2 rounded-xl border border-white/10 bg-slate-900/95 p-4 backdrop-blur-sm xl:hidden">
          <div className="mb-4">
            <CharacterSearch />
          </div>
          <nav className="flex flex-col gap-3">
            <Link
              href="/ranking"
              className="block py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              랭킹
            </Link>
            <Link
              href="/market"
              className="block py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              거래소
            </Link>
            <Link
              href="/guild"
              className="block py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              길드
            </Link>
            <Link
              href="/cunning-paper"
              className="block py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              컨닝페이퍼
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
