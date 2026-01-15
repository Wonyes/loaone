import { createClient } from "@/lib/supabase/discode/discode";
import { NextRequest, NextResponse } from "next/server";

// GET: 즐겨찾기 상태 확인
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const name = searchParams.get("name");

  if (!name) {
    return NextResponse.json({ error: "Name required" }, { status: 400 });
  }

  const supabase = createClient();

  // 현재 사용자 확인
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ favorited: false });
  }

  // 즐겨찾기 확인
  const { data, error } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("character_name", name)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Favorites GET error:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }

  return NextResponse.json({ favorited: !!data });
}

// POST: 즐겨찾기 토글
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { characterName } = body;

    if (!characterName) {
      return NextResponse.json(
        { error: "Character name required" },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // 현재 사용자 확인
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 기존 즐겨찾기 확인
    const { data: existing } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("character_name", characterName)
      .single();

    if (existing) {
      // 이미 즐겨찾기 → 삭제
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("id", existing.id);

      if (error) throw error;

      return NextResponse.json({ favorited: false });
    } else {
      // 즐겨찾기 추가
      const { error } = await supabase.from("favorites").insert({
        user_id: user.id,
        character_name: characterName,
      });

      if (error) throw error;

      return NextResponse.json({ favorited: true });
    }
  } catch (error) {
    console.error("Favorites POST error:", error);
    return NextResponse.json({ error: "Failed to toggle" }, { status: 500 });
  }
}
