"use client";

import { useUser } from "@/hooks/useUesr";
import { signInWithDiscord } from "@/lib/supabase/discode/discode";
import ShowcaseRegisterForm from "@/components/showcase/ShowcaseRegisterForm";
import { FaDiscord } from "react-icons/fa";
import { Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ShowcaseRegisterClient() {
  const { user, loading } = useUser();

  const handleLogin = async () => {
    try {
      await signInWithDiscord();
    } catch (error) {
      console.error("로그인 실패:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <Link
          href="/showcase"
          className="mb-4 inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          갤러리로 돌아가기
        </Link>

        <div className="flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-purple-400" />
          <h1 className="text-2xl font-black tracking-tight text-white">
            대표 캐릭터 등록
          </h1>
        </div>
        <p className="mt-2 text-sm text-gray-400">
          나만의 아바타를 갤러리에 등록하고 자랑해보세요
        </p>
      </div>

      {user ? (
        <ShowcaseRegisterForm />
      ) : (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/[0.02] py-20">
          <FaDiscord className="mb-4 h-12 w-12 text-[#5865F2]" />
          <h2 className="mb-2 text-xl font-bold text-white">로그인이 필요합니다</h2>
          <p className="mb-6 text-sm text-gray-400">
            Discord로 로그인하여 캐릭터를 등록해보세요
          </p>
          <button
            onClick={handleLogin}
            className="flex items-center gap-3 rounded-full bg-[#5865F2] px-8 py-3 font-bold text-white transition-all hover:bg-[#4752C4]"
          >
            <FaDiscord className="h-5 w-5" />
            Discord로 로그인
          </button>
        </div>
      )}
    </div>
  );
}
