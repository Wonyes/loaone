"use client";

import { useAuth, useLogout } from "@/hooks/query/useAuth";

export function LoginButton() {
  const { data: user, isLoading } = useAuth();
  const { mutate: logout } = useLogout();

  const loginWithDiscord = () => {
    if (user) {
      logout();
    } else {
      const returnTo = window.location.pathname + window.location.search;

      const redirectUri = encodeURIComponent("http://localhost:4001/auth/discord/callback");

      const state = encodeURIComponent(returnTo);

      window.location.href =
        "https://discord.com/oauth2/authorize" +
        `?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}` +
        `&redirect_uri=${redirectUri}` +
        `&response_type=code` +
        `&scope=identify email` +
        `&state=${state}`;
    }
  };

  return (
    <button
      onClick={loginWithDiscord}
      className="px-4 py-2 bg-blue-600 text-white rounded"
    >
      {user === undefined ? "Discord로 로그인" : user ? "로그아웃" : "Discord로 로그인"}
    </button>
  );
}
