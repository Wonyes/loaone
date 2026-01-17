import { NextRequest, NextResponse } from "next/server";
import { fetchLostArkCharacter } from "@/lib/lostark/api";
import { createSupabaseServer } from "@/lib/supabase/server/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer();
    const { searchParams } = new URL(request.url);
    const characterName = searchParams.get("name");

    if (!characterName)
      return NextResponse.json({ error: "Name required" }, { status: 400 });

    const apiData = await fetchLostArkCharacter(characterName);

    // 💡 1. 숫자를 '정수'로 변환하여 오차를 원천 차단 (소수점 2자리까지 정수화)
    // 예: 1720.33 -> 172033
    const currentLevelInt = Math.round(
      parseFloat(apiData.ItemAvgLevel.replace(/,/g, "")) * 100
    );
    const currentCPInt = Math.round(
      parseFloat(apiData.CombatPower.replace(/,/g, "")) * 100
    );

    // 2. 마지막 기록 조회 (날짜가 null인 쓰레기 데이터는 무시하고 진짜 마지막 하나만)
    const { data: lastRecord } = await supabase
      .from("level_history")
      .select("item_level, combat_power")
      .eq("character_name", characterName)
      .not("recorded_at", "is", null) // 💡 날짜 없는 데이터 제외
      .order("recorded_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    // 💡 3. 정수 비교 (가장 확실함)
    const lastLevelInt = lastRecord
      ? Math.round(Number(lastRecord.item_level) * 100)
      : null;
    const lastCPInt = lastRecord
      ? Math.round(Number(lastRecord.combat_power) * 100)
      : null;

    // 저장 조건: 기록이 없거나, 레벨 정수값이 다르거나, 전투력 정수값이 올랐을 때
    const isNew = !lastRecord;
    const isLevelChanged =
      lastLevelInt !== null && lastLevelInt !== currentLevelInt;
    const isCpIncreased = lastCPInt !== null && currentCPInt > lastCPInt;

    if (isNew || isLevelChanged || isCpIncreased) {
      // 저장할 때는 다시 소수점 형태로 변환
      const levelChange =
        lastLevelInt !== null ? (currentLevelInt - lastLevelInt) / 100 : 0;

      const { error: insertError } = await supabase
        .from("level_history")
        .insert({
          character_name: apiData.CharacterName,
          item_level: currentLevelInt / 100,
          combat_power: currentCPInt / 100,
          level_change: levelChange,
          recorded_at: new Date().toISOString(),
        });

      if (insertError) throw insertError;
      console.log(
        `✅ [${characterName}] 새 기록 저장: ${currentLevelInt / 100}`
      );
    } else {
      console.log(`🚫 [${characterName}] 중복: 저장 패스`);
    }

    // 4. 조회 (차트용: 과거 -> 현재)
    const { data: history } = await supabase
      .from("level_history")
      .select("*")
      .eq("character_name", characterName)
      .not("recorded_at", "is", null) // 쓰레기 데이터 제외
      .order("recorded_at", { ascending: true });

    return NextResponse.json({
      history: history || [],
      stats: calculateStats(history || []),
    });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

function calculateStats(history: any[]) {
  if (history.length === 0) {
    return {
      totalChanges: 0,
      totalGain: 0,
      totalLoss: 0,
      netChange: 0,
      cpGain: 0,
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

  // 전투력 상승량 합산
  const cpGain = history
    .filter(h => h.cp_change > 0)
    .reduce((sum, h) => sum + h.cp_change, 0);

  const levels = history.map(h => h.item_level);

  return {
    totalChanges: history.length,
    totalGain: Number(totalGain.toFixed(2)),
    totalLoss: Number(totalLoss.toFixed(2)),
    netChange: Number((totalGain - totalLoss).toFixed(2)),
    cpGain: Number(cpGain.toFixed(2)),
    averageChange: Number(
      ((totalGain - totalLoss) / history.length).toFixed(2)
    ),
    maxLevel: Math.max(...levels),
    minLevel: Math.min(...levels),
    currentLevel: levels[levels.length - 1],
    firstRecorded: history[0].recorded_at,
    lastRecorded: history[history.length - 1].recorded_at,
  };
}
