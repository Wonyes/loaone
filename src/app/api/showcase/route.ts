import { createSupabaseServer } from "@/lib/supabase/server/server";
import { NextRequest, NextResponse } from "next/server";
import { ShowcaseUpsertRequest } from "@/types/showcase";

// GET: 내 showcase 조회
export async function GET() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ showcase: null });
  }

  const { data, error } = await supabase
    .from("avatar_showcase")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Showcase fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch showcase" }, { status: 500 });
  }

  return NextResponse.json({ showcase: data });
}

// POST: 등록/수정 (upsert)
export async function POST(request: NextRequest) {
  try {
    const body: ShowcaseUpsertRequest = await request.json();
    const { character_name, server_name, class_name, item_level, character_image, description } = body;

    if (!character_name) {
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

    // upsert (user_id 기준 unique)
    const { data, error } = await supabase
      .from("avatar_showcase")
      .upsert(
        {
          user_id: user.id,
          character_name,
          server_name: server_name || null,
          class_name: class_name || null,
          item_level: item_level || null,
          character_image: character_image || null,
          description: description || null,
        },
        { onConflict: "user_id" }
      )
      .select()
      .single();

    if (error) {
      console.error("Showcase upsert error:", error);
      return NextResponse.json(
        { error: "Failed to save showcase" },
        { status: 500 }
      );
    }

    return NextResponse.json({ showcase: data });
  } catch (error) {
    console.error("Showcase error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE: 내 showcase 삭제
export async function DELETE() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase
    .from("avatar_showcase")
    .delete()
    .eq("user_id", user.id);

  if (error) {
    console.error("Showcase delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete showcase" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
