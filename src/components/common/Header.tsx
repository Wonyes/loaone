"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LoginButton } from "./LoginButton";
import { CharacterSearch } from "../character/CharacterSearch";
import { Menu, X, ArrowUpRight, Leaf } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function Header() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  if (pathname === "/setup-character") return null;

  const navLinks = [
    {
      name: "paper",
      href: "/cunning-paper",
      title: "로스트아크 레이드 공략 컨닝페이퍼",
    },
    {
      name: "ranking",
      href: "/rankings",
      in: "character",
      title: "캐릭터 아이템 레벨 랭킹",
    },
    {
      name: "avatar",
      href: "/showcase",
      title: "아바타 자랑 갤러리",
    },
    {
      name: "profile",
      href: "/profile",
      title: "내 프로필",
    },
  ];

  return (
    <header className="sticky top-4 z-50 mb-4 w-full rounded-full border-b border-[#bef264]/10 bg-gradient-to-r from-[#041d1d] via-[#062c2c] to-[#041d1d] shadow-[0_10px_40px_rgba(0,0,0,0.4)]">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between px-6">
        <div className="flex items-center gap-12">
          <Logo onClick={() => router.push("/")} />

          <nav
            className="hidden items-center gap-2 lg:flex"
            aria-label="Main Navigation"
          >
            {navLinks.map(link => (
              <NavLink
                key={link.href}
                href={link.href}
                isActive={
                  pathname.includes(link.href) ||
                  (link.in && pathname.includes(link.in))
                }
                title={link.title}
                name={link.name}
              ></NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden w-72 lg:block">
            <CharacterSearch />
          </div>

          <div className="flex items-center gap-4 border-l border-white/5 pl-6">
            <LoginButton />

            <button
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#bef264]/20 bg-teal-900/30 text-[#bef264] transition-all hover:bg-[#bef264]/20 active:scale-95 lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu Open"
              title="Menu Open"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <MobileMenu
          navLinks={navLinks}
          pathname={pathname}
          onClose={() => setMobileMenuOpen(false)}
        />
      )}
    </header>
  );
}

function Logo({ onClick }: { onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      aria-label="로아원 홈"
      className="group relative flex cursor-pointer items-center gap-3"
    >
      <div className="relative flex h-10 w-10 items-center justify-center">
        <img
          src="/assets/logo.png"
          alt="로아원"
          className="relative z-10 h-12 w-auto object-contain transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
        />
      </div>
      <span className="hidden text-[18px] font-black tracking-tighter text-white italic sm:block">
        LOA
        <span className="text-[#bef264] italic drop-shadow-[0_0_8px_rgba(190,242,100,0.4)]">
          ONE
        </span>
      </span>
    </div>
  );
}

function NavLink({
  href,
  name,
  title,
  isActive,
}: {
  name: string;
  href: string;
  title: string;
  isActive: boolean | undefined | "";
}) {
  return (
    <Link
      href={href}
      title={title}
      prefetch={false}
      className={cn(
        "relative px-4 py-1 text-[12px] tracking-[0.1em] uppercase italic transition-all duration-300",
        isActive
          ? "border-b border-[#bef264]/50 text-[#bef264]"
          : "text-teal-100/60 hover:text-[#bef264]"
      )}
    >
      {name}
      {isActive && (
        <>
          <div className="animate-in zoom-in fade-in absolute -top-0.5 -right-0.5 z-20 duration-500">
            <Leaf
              size={14}
              className="rotate-[15deg] fill-[#bef264] text-[#bef264] drop-shadow-[0_0_5px_rgba(190,242,100,0.8)]"
            />
          </div>
        </>
      )}
    </Link>
  );
}

function MobileMenu({
  navLinks,
  pathname,
  onClose,
}: {
  navLinks: Array<{ name: string; href: string; in?: string }>;
  pathname: string;
  onClose: () => void;
}) {
  return (
    <div className="animate-in fade-in slide-in-from-top-2 absolute inset-x-0 top-20 z-40 max-w-[1400px] rounded-lg bg-gradient-to-b from-[#062c2c] to-[#041d1d] p-6 duration-300 lg:hidden">
      <div className="flex flex-col gap-2">
        <div className="space-y-4">
          <p className="px-1 text-[10px] font-black tracking-[0.2em] text-[#bef264]/60 uppercase">
            Character Search
          </p>
          <CharacterSearch />
        </div>

        <nav className="flex flex-col">
          {navLinks.map((link, idx) => (
            <Link
              key={link.href}
              href={link.href}
              title={link.name}
              onClick={onClose}
              className={cn(
                "relative flex items-center justify-between py-5 text-xl font-black tracking-tighter uppercase transition-all active:translate-x-2",
                idx > 0 && "border-t border-white/5",
                pathname.includes(link.href) ||
                  (link.in && pathname.includes(link.in))
                  ? "text-[#bef264]"
                  : "text-teal-50/70"
              )}
            >
              {link.name}
              <ArrowUpRight size={20} className="text-[#bef264] opacity-20" />
              {(pathname.includes(link.href) ||
                (link.in && pathname.includes(link.in))) && (
                <div className="animate-in zoom-in fade-in absolute top-4 -left-2.5 z-90 duration-500">
                  <Leaf
                    size={14}
                    className="rotate-[280deg] fill-[#bef264] text-[#bef264] drop-shadow-[0_0_5px_rgba(190,242,100,0.8)]"
                  />
                </div>
              )}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
