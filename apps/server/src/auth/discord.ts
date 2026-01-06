import axios from "axios";

export async function getDiscordUser(code: string) {
  const tokenRes = await axios.post(
    "https://discord.com/api/oauth2/token",
    new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID!,
      client_secret: process.env.DISCORD_CLIENT_SECRET!,
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.DISCORD_REDIRECT_URI!,
    }),
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }
  );

  const { access_token } = tokenRes.data;

  const userRes = await axios.get("https://discord.com/api/users/@me", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  return userRes.data;
}
