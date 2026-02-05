"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LoginButton } from "./LoginButton";
import { CharacterSearch } from "../character/CharacterSearch";
import { Menu, X, ArrowUpRight, Leaf } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useNoticeStore } from "@/hooks/store/useNoticeStore";
import { useUser } from "@/hooks/useUesr";
import { signInWithDiscord } from "@/lib/supabase/discode/discode";

export function Header() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const { user } = useUser();

  const showAlert = useNoticeStore(state => state.showAlert);

  const toggleLogin = (e: React.MouseEvent, title: string) => {
    if (!user && title === "profile") {
      e.preventDefault();
      showAlert(
        "로그인이 필요합니다.",
        "프로필 입장은 로그인이 필요합니다.",
        "디스코드로 로그인하기",
        handleLogin
      );
      return;
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithDiscord();
    } catch (error) {
      console.error("로그인 실패:", error);
    }
  };

  if (pathname === "/setup-character") return null;

  const mobileProfile = (e: React.MouseEvent, title: string) => {
    toggleLogin(e, title);
    setMobileMenuOpen(false);
  };

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
    <header className="sticky top-4 z-50 mb-4 w-full rounded-full bg-gradient-to-r from-[#041d1d] via-[#062c2c] to-[#041d1d] shadow-[0_6px_20px_rgba(0,0,0,0.25),0_3px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)]">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-6">
        <div className="flex items-center gap-12">
          <Logo onClick={() => router.push("/")} />

          <nav
            className="nav:flex hidden items-center gap-2"
            aria-label="Main Navigation"
          >
            {navLinks.map(link => (
              <NavLink
                key={link.href}
                href={link.href}
                onClick={e => toggleLogin(e, link.name)}
                isActive={
                  pathname.includes(link.href) ||
                  (link.in && pathname.includes(link.in))
                }
                title={link.title}
                name={link.name}
              />
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <div className="nav:block hidden">
            <CharacterSearch />
          </div>

          <div className="flex items-center gap-4">
            <LoginButton />

            <button
              className="nav:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-[#bef264]/20 bg-teal-900/30 text-[#bef264] transition-all hover:bg-[#bef264]/20 active:scale-95"
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
          onClose={mobileProfile}
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
  onClick,
  isActive,
}: {
  name: string;
  href: string;
  title: string;
  isActive: boolean | undefined | "";
  onClick: (e: React.MouseEvent, title: string) => void;
}) {
  return (
    <Link
      href={href}
      title={title}
      onClick={e => onClick(e, name)}
      prefetch={false}
      className={cn(
        "relative rounded-xl px-4 py-2 text-[12px] font-bold tracking-[0.1em] uppercase italic transition-all duration-200",
        isActive
          ? "bg-white/[0.08] text-[#bef264] shadow-[0_4px_12px_rgba(0,0,0,0.25),0_2px_4px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)]"
          : "text-teal-100/60 hover:bg-white/[0.03] hover:text-[#bef264]"
      )}
    >
      {name}
      {isActive && (
        <div className="animate-in zoom-in fade-in absolute -top-0.5 -right-0.5 z-20 duration-500">
          <Leaf
            size={14}
            className="rotate-[15deg] fill-[#bef264] text-[#bef264] drop-shadow-[0_0_5px_rgba(190,242,100,0.8)]"
          />
        </div>
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
  onClose: (e: React.MouseEvent, title: string) => void;
}) {
  return (
    <div className="animate-in fade-in slide-in-from-top-2 nav:hidden absolute inset-x-0 top-20 z-40 max-w-[1400px] rounded-lg bg-gradient-to-b from-[#062c2c] to-[#041d1d] p-6 duration-300">
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
              onClick={e => onClose(e, link.name)}
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
