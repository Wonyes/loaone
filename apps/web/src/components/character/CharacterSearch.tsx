"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/common/Input";

export function CharacterSearch() {
  const [name, setName] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (name.trim()) {
      router.push(`/characters/${encodeURIComponent(name.trim())}`);
    }
  };

  return (
    <div className="mx-auto w-full max-w-150">
      <Input
        name="characterName"
        value={name}
        onChange={e => setName(e.target.value)}
        onKeyDown={e => e.key === "Enter" && handleSearch()}
        placeholder="캐릭터 이름을 입력하세요"
        showSearchButton
        onSearch={handleSearch}
      />
    </div>
  );
}
