import { NextResponse } from "next/server";

export async function fetchCharacter(name: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/lostark/character/${name}`);
  return res.json();
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect("/login");
  }

  const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID!,
      client_secret: process.env.DISCORD_CLIENT_SECRET!,
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.DISCORD_REDIRECT_URI!,
    }),
  });

  const token = await tokenRes.json();

  const userRes = await fetch("https://discord.com/api/users/@me", {
    headers: {
      Authorization: `Bearer ${token.access_token}`,
    },
  });

  const user = await userRes.json();

  // TODO: 쿠키/JWT 발급 or server로 전달
  return NextResponse.redirect("/");
}
