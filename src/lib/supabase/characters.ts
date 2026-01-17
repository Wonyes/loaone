import type { Character, CharacterUpdate } from "@/types/database";
import { supabase } from "./client/client";

/**
 * 특정 캐릭터 가져오기
 */
export async function getCharacter(
  characterId: string
): Promise<Character | null> {
  const { data, error } = await supabase
    .from("characters")
    .select("*")
    .eq("id", characterId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }

  return data;
}

/**
 * 캐릭터 업데이트
 */
export async function updateCharacter(
  characterId: string,
  updates: CharacterUpdate
): Promise<Character> {
  const { data, error } = await supabase
    .from("characters")
    .update(updates)
    .eq("id", characterId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
