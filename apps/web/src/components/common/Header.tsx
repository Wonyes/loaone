"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoginButton } from "./LoginButton";
import { CharacterSearch } from "../character/CharacterSearch";

export function Header() {
  const router = useRouter();

  return (
    <header className="design-card sticky top-4 z-50 m-0 mx-auto flex h-16 w-full items-center rounded-full px-6">
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
          <div className="pl-10">
            <nav className="flex items-center gap-6">
              <Link href="/ranking" className="block">
                <span>랭킹</span>
              </Link>
              <Link href="/market" className="block">
                <span>거래소</span>
              </Link>
              <Link href="/trader" className="block">
                <span>떠돌이 상인</span>
              </Link>
              <Link href="/guild" className="block">
                <span>길드</span>
              </Link>
              <Link href="/cunning-paper" className="block">
                <span>컨닝페이퍼</span>
              </Link>
              <Link href="/design" className="block">
                <span>디자인 시스템</span>
              </Link>
            </nav>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <CharacterSearch />
          <LoginButton />
        </div>
      </div>
    </header>
  );
}
