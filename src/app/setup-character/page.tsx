"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/discode/discode";
import { useUser } from "@/hooks/useUesr";
import { Input } from "@/components/common/Input";

export default function SetupCharacterPage() {
  const router = useRouter();
  const { user, loading } = useUser();
  const [characterName, setCharacterName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    const trimmed = characterName.trim();
    if (!trimmed) {
      setError("캐릭터명을 입력해주세요.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({
        data: { main_character: trimmed },
      });

      if (updateError) throw updateError;

      router.push("/");
    } catch (e) {
      console.error("캐릭터 저장 실패:", e);
      setError("저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-500 border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    router.push("/");
    return null;
  }

  return (
    <div className="fiexd flex min-h-[100vh] items-center justify-center">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0c0d12]/80 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="mb-5">
          <h1 className="text-sm font-black tracking-tight text-white">
            대표 캐릭터 설정
          </h1>
          <p className="mt-1 text-[11px] text-slate-400">
            로스트아크 대표 캐릭터명을 입력해주세요.
          </p>
        </div>

        <Input
          value={characterName}
          onChange={e => {
            setCharacterName(e.target.value);
            if (error) setError("");
          }}
          onEnter={handleSave}
          placeholder="캐릭터명 입력"
          containerClassName="mb-3"
          autoFocus
        />

        {error && <p className="mb-3 text-[11px] text-rose-400">{error}</p>}

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full rounded-xl border border-teal-500/30 bg-teal-600/20 px-4 py-2.5 text-xs font-bold text-teal-300 transition-all hover:bg-teal-600/30 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "저장 중..." : "저장"}
        </button>
      </div>
    </div>
  );
}
