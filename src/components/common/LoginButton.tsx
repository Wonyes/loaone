"use client";

import { useRouter } from "next/navigation";
import { LogOut, ChevronDown, UserPen, User } from "lucide-react";
import { FaDiscord } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { signInWithDiscord, signOut } from "@/lib/supabase/discode/discode";
import { useUser } from "@/hooks/useUesr";

export function LoginButton() {
  const { user, loading } = useUser();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await signInWithDiscord();
    } catch (error) {
      console.error("로그인 실패:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      window.location.reload();
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  if (loading) {
    return (
      <div className="h-9 w-24 animate-pulse rounded-full border border-white/5 bg-white/[0.02]" />
    );
  }

  if (user) {
    const avatarUrl = user.user_metadata.avatar_url;
    const username =
      user.user_metadata.custom_claims.global_name ||
      user.user_metadata.full_name ||
      "User";
    const mainCharacter = user.user_metadata?.main_character;

    return (
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button className="group relative flex cursor-pointer items-center gap-2.5 rounded-full border border-teal-500/20 bg-teal-950/20 py-1 pr-3 pl-1 shadow-[0_4px_12px_rgba(0,0,0,0.25),0_2px_4px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)] transition-all outline-none hover:border-teal-500/40 hover:bg-teal-900/30 active:scale-95">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-[#bef264]/20 opacity-0 blur-[8px] transition-opacity group-hover:opacity-100" />
              <Avatar className="h-7 w-7 border border-white/10 ring-1 ring-teal-500/20">
                <AvatarImage src={avatarUrl} alt={username} />
              </Avatar>
            </div>

            <div className="flex min-w-[60px] flex-col items-start">
              <span className="mb-0.5 truncate text-xs leading-none font-black tracking-tight text-white">
                {username}
              </span>
              <span className="text-[8px] leading-none font-bold tracking-widest text-teal-500/60 uppercase">
                {mainCharacter || "Authorized"}
              </span>
            </div>

            <ChevronDown className="h-3 w-3 text-slate-300 transition-transform group-data-[state=open]:rotate-180" />

            <div className="absolute -bottom-px left-1/2 h-[1px] w-0 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#bef264]/50 to-transparent transition-all group-hover:w-1/2" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="mt-2 w-48 overflow-hidden rounded-2xl border border-white/10 bg-[#0c0d12]/95 p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        >
          <div className="flex">
            <Avatar className="h-12 w-12 border border-white/10 ring-1 ring-teal-500/20">
              <AvatarImage src={avatarUrl} alt={username} />
            </Avatar>
            <div className="mb-1 flex flex-col gap-0.5 px-3 py-2.5">
              <p className="text-[9px] font-black tracking-[0.2em] text-slate-400 uppercase">
                Account
              </p>
              <p className="max-w-[110px] truncate text-xs font-bold text-slate-200">
                {user.email}
              </p>
              {mainCharacter && (
                <p className="max-w-[110px] truncate text-[10px] font-bold text-teal-400">
                  {mainCharacter}
                </p>
              )}
            </div>
          </div>

          <DropdownMenuItem
            onClick={() => router.push("/profile")}
            className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-[11px] font-bold text-slate-300 transition-all hover:bg-white/5 focus:bg-white/5 focus:text-white"
          >
            <span className="text-xs">프로필</span>
            <User className="h-3 w-3" />
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => router.push("/setup-character")}
            className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-[11px] font-bold text-slate-300 transition-all hover:bg-white/5 focus:bg-white/5 focus:text-white"
          >
            <span className="text-xs">대표 캐릭터 변경</span>
            <UserPen className="h-3 w-3" />
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handleLogout}
            className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-[11px] font-bold text-rose-400 transition-all hover:bg-rose-500/10 focus:bg-rose-500/10 focus:text-rose-300"
          >
            <span className="text-xs">로그아웃</span>
            <LogOut className="h-2 w-2" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <button
      onClick={handleLogin}
      className="group relative flex items-center gap-3 overflow-hidden rounded-full border border-indigo-500/30 bg-indigo-600/10 px-6 py-2.5 shadow-[0_4px_12px_rgba(0,0,0,0.25),0_2px_4px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)] transition-all hover:bg-indigo-600/20 active:scale-95"
    >
      <div className="absolute inset-0 bg-indigo-500/5 opacity-0 transition-opacity group-hover:opacity-100" />

      <FaDiscord className="relative z-10 h-4 w-4 text-[#5865F2] transition-colors group-hover:text-white" />

      <div className="relative z-10 flex flex-col items-start">
        <span className="mb-0.5 text-[12px] leading-none font-black tracking-tighter text-white uppercase">
          Login
        </span>
        <span className="text-[8px] leading-none font-bold tracking-widest text-indigo-400 opacity-60">
          Discord Auth
        </span>
      </div>

      <ChevronDown className="h-3 w-3 -rotate-90 text-indigo-500/50 transition-transform group-hover:translate-x-1" />

      <div className="absolute inset-x-0 bottom-0 h-[1.5px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
    </button>
  );
}
