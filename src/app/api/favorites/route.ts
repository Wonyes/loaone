import { createSupabaseServer } from "@/lib/supabase/server/server";
import { NextRequest, NextResponse } from "next/server";

// GET: 개별 상태 확인
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const name = searchParams.get("name");

  if (!name) {
    return NextResponse.json(
      { error: "Character name required" },
      { status: 400 }
    );
  }

  const supabase = await createSupabaseServer();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ favorited: false });
  }

  const { data, error } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("character_name", name)
    .maybeSingle();

  if (error) {
    console.error("Favorite check error:", error);
    return NextResponse.json({ favorited: false });
  }

  return NextResponse.json({ favorited: !!data });
}

// POST: 즐겨찾기 토글
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { characterName, serverName, itemLevel, className } = body;

    if (!characterName) {
      return NextResponse.json(
        { error: "Character name required" },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServer();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: existing, error: checkError } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("character_name", characterName)
      .maybeSingle();

    if (checkError) {
      console.error("Check error:", checkError);
      return NextResponse.json(
        { error: "Failed to check status" },
        { status: 500 }
      );
    }

    if (existing) {
      const { error: deleteError } = await supabase
        .from("favorites")
        .delete()
        .eq("id", existing.id);

      if (deleteError) {
        console.error("Delete error:", deleteError);
        return NextResponse.json(
          { error: "Failed to remove favorite" },
          { status: 500 }
        );
      }

      return NextResponse.json({ favorited: false });
    } else {
      const { error: insertError } = await supabase.from("favorites").insert({
        user_id: user.id,
        character_name: characterName,
        server_name: serverName,
        item_level: itemLevel,
        class: className,
        created_at: new Date().toISOString(),
      });

      if (insertError) {
        console.error("Insert error:", insertError);
        return NextResponse.json(
          { error: "Failed to add favorite" },
          { status: 500 }
        );
      }

      return NextResponse.json({ favorited: true });
    }
  } catch (error) {
    console.error("Toggle error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
