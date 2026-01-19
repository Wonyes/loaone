import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Discord 로그인
export async function signInWithDiscord() {
  const supabase = createClient();

  const isKakaoTalk = /KAKAOTALK/i.test(navigator.userAgent);

  if (isKakaoTalk) {
    window.location.href = `kakaotalk://web/openExternalApp?url=${encodeURIComponent(window.location.href)}`;
    return;
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "discord",
    options: {
      redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(window.location.pathname)}`,
      skipBrowserRedirect: true,
    },
  });

  if (error) throw error;

  if (data?.url) {
    window.location.href = data.url;
  }
}

// 로그아웃
export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
