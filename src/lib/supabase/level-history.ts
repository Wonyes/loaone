// src/lib/supabase/level-history.ts
import type { LevelHistory, LevelHistoryInsert } from "@/types/database";
import { createSupabaseServer } from "./server/server";

/**
 * 레벨 변화 기록 추가
 */
export async function recordLevelChange(
  data: LevelHistoryInsert
): Promise<LevelHistory> {
  const supabase = await createSupabaseServer();

  const { data: record, error } = await supabase
    .from("level_history")
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return record;
}

/**
 * 캐릭터의 레벨 히스토리 가져오기
 */
export async function getLevelHistory(
  characterId: string,
  period?: "7d" | "30d" | "90d" | "all"
): Promise<LevelHistory[]> {
  const supabase = await createSupabaseServer();

  let query = supabase
    .from("level_history")
    .select("*")
    .eq("character_id", characterId)
    .order("recorded_at", { ascending: true });

  // 기간 필터
  if (period && period !== "all") {
    const now = new Date();
    let daysAgo: number;

    switch (period) {
      case "7d":
        daysAgo = 7;
        break;
      case "30d":
        daysAgo = 30;
        break;
      case "90d":
        daysAgo = 90;
        break;
    }

    const startDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    query = query.gte("recorded_at", startDate.toISOString());
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

/**
 * 최근 레벨 변화 N개 가져오기
 */
export async function getRecentLevelChanges(
  characterId: string,
  limit: number = 10
): Promise<LevelHistory[]> {
  const supabase = await createSupabaseServer();

  const { data, error } = await supabase
    .from("level_history")
    .select("*")
    .eq("character_id", characterId)
    .order("recorded_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

/**
 * 레벨 통계
 */
export interface LevelStats {
  totalChanges: number;
  totalGain: number;
  totalLoss: number;
  netChange: number;
  averageChange: number;
  maxLevel: number;
  minLevel: number;
  currentLevel: number;
  firstRecorded: string | null;
  lastRecorded: string | null;
}

export async function getLevelStats(
  characterId: string,
  period: "7d" | "30d" | "90d" | "all" = "all"
): Promise<LevelStats> {
  const history = await getLevelHistory(characterId, period);

  if (history.length === 0) {
    return {
      totalChanges: 0,
      totalGain: 0,
      totalLoss: 0,
      netChange: 0,
      averageChange: 0,
      maxLevel: 0,
      minLevel: 0,
      currentLevel: 0,
      firstRecorded: null,
      lastRecorded: null,
    };
  }

  const totalGain = history
    .filter(h => h.level_change > 0)
    .reduce((sum, h) => sum + h.level_change, 0);

  const totalLoss = history
    .filter(h => h.level_change < 0)
    .reduce((sum, h) => sum + Math.abs(h.level_change), 0);

  const netChange = totalGain - totalLoss;
  const levels = history.map(h => h.item_level);

  return {
    totalChanges: history.length,
    totalGain: Number(totalGain.toFixed(2)),
    totalLoss: Number(totalLoss.toFixed(2)),
    netChange: Number(netChange.toFixed(2)),
    averageChange: Number((netChange / history.length).toFixed(2)),
    maxLevel: Math.max(...levels),
    minLevel: Math.min(...levels),
    currentLevel: levels[levels.length - 1],
    firstRecorded: history[0].recorded_at,
    lastRecorded: history[history.length - 1].recorded_at,
  };
}
