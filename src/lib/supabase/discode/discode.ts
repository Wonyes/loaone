import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * 한국 시간 기준 YYYY-MM-DD 구하기
 */
export function getKSTDate() {
  const now = new Date();
  // sv-SE 포맷은 YYYY-MM-DD 형식을 반환하며, 타임존을 한국으로 강제합니다.
  return now.toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
}

/**
 * Discord 로그인
 */
export async function signInWithDiscord() {
  const supabase = createClient();

  // 1. 카카오톡 인앱 브라우저 탈출 로직
  const isKakaoTalk = /KAKAOTALK/i.test(navigator.userAgent);
  if (isKakaoTalk) {
    window.location.href = `kakaotalk://web/openExternalApp?url=${encodeURIComponent(window.location.href)}`;
    return;
  }

  // 2. 로그인 실행
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "discord",
    options: {
      queryParams: {
        prompt: "consent",
      },
      redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(window.location.pathname)}`,
    },
  });

  if (error) {
    console.error("로그인 에러:", error.message);
    throw error;
  }
}

/**
 * 로그아웃
 */
export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
