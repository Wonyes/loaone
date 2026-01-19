import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// 1. 한국 시간대 날짜 구하기 (YYYY-MM-DD)
export function getKSTDate() {
  // sv-SE 포맷은 YYYY-MM-DD 형식을 유지하면서 타임존 설정이 가능합니다.
  return new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
}

// 2. Discord 로그인
export async function signInWithDiscord() {
  const supabase = createClient();

  const isKakaoTalk = /KAKAOTALK/i.test(navigator.userAgent);

  // 카카오톡 인앱 브라우저 탈출
  if (isKakaoTalk) {
    window.location.href = `kakaotalk://web/openExternalApp?url=${encodeURIComponent(window.location.href)}`;
    return;
  }

  // 앱 실행 성공률을 높이기 위한 설정
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "discord",
    options: {
      redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(window.location.pathname)}`,
      // prompt: 'none'은 세션이 있으면 바로 승인하게 하고,
      // 앱 전환을 더 강력하게 유도하려면 queryParams에 아래 설정을 넣기도 합니다.
      queryParams: {
        prompt: "consent",
      },
    },
  });

  if (error) throw error;
  // skipBrowserRedirect: true를 빼면 Supabase가 가장 빠른 경로로 리다이렉트합니다.
}

// 3. 로그아웃
export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
