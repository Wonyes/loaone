"use client";

import { LogOut, ChevronDown, User } from "lucide-react";
import { FaDiscord } from "react-icons/fa"; // 추가
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Loading from "@/app/loading";
import ErrorCompo from "@/app/error";
import { useAuth, useLogout } from "@/hooks/query/useAuth";

export function LoginButton() {
  const { data: user, isLoading, error } = useAuth();
  const { mutate: logout } = useLogout();

  const loginWithDiscord = () => {
    const returnTo = window.location.pathname + window.location.search;
    const redirectUri = encodeURIComponent(
      "http://localhost:4001/auth/discord/callback"
    );
    const state = encodeURIComponent(returnTo);

    window.location.href =
      "https://discord.com/oauth2/authorize" +
      `?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}` +
      `&redirect_uri=${redirectUri}` +
      `&response_type=code` +
      `&scope=identify email` +
      `&state=${state}`;
  };

  if (user) {
    const avatarUrl = user.avatar
      ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
      : undefined;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/50 py-1 pr-4 pl-1 text-sm font-medium text-white transition-colors outline-none hover:bg-slate-800 focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-900">
            <Avatar className="h-8 w-8 border border-white/10">
              <AvatarImage src={avatarUrl} alt={user.username} />
            </Avatar>

            <span className="flex max-w-[100px] items-center truncate pb-px text-[14px] leading-none font-semibold">
              {user.username || "User"}
            </span>

            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-48 border-slate-800 bg-slate-900 text-slate-200"
        >
          <DropdownMenuLabel>내 계정</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-slate-800" />
          <DropdownMenuItem className="cursor-pointer hover:bg-gray-800 focus:bg-slate-800">
            <User className="mr-2 h-4 w-4" />
            <span>프로필 보기</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => logout()}
            className="cursor-pointer text-red-400 hover:bg-red-950/30 hover:text-red-400 focus:bg-red-950/30 focus:text-red-300"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>로그아웃</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (isLoading) {
    return <Loading />;
  } else if (error) {
    return <ErrorCompo />;
  }

  return (
    <button
      onClick={loginWithDiscord}
      className="position flex items-center gap-2 rounded-full bg-[#5865F2]/80 px-5 py-2 text-sm font-bold text-white shadow-md shadow-indigo-500/20 transition-all hover:scale-105 hover:bg-[#5865F2]"
    >
      <FaDiscord className="h-5 w-5" />
      <span className="whitespace-nowrap">로그인</span>
    </button>
  );
}
