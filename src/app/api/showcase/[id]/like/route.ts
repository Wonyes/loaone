import { createSupabaseServer } from "@/lib/supabase/server/server";
import { NextRequest, NextResponse } from "next/server";

// GET: 좋아요 상태 확인
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: showcaseId } = await params;

  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ liked: false, count: 0 });
  }

  // 좋아요 상태 확인
  const { data: likeData } = await supabase
    .from("avatar_likes")
    .select("id")
    .eq("showcase_id", showcaseId)
    .eq("user_id", user.id)
    .maybeSingle();

  // 좋아요 수 확인
  const { count } = await supabase
    .from("avatar_likes")
    .select("*", { count: "exact", head: true })
    .eq("showcase_id", showcaseId);

  return NextResponse.json({
    liked: !!likeData,
    count: count || 0,
  });
}

// POST: 좋아요 토글
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: showcaseId } = await params;

  const supabase = await createSupabaseServer();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // showcase 존재 및 공개 여부 확인
  const { data: showcase, error: showcaseError } = await supabase
    .from("avatar_showcase")
    .select("id, is_public")
    .eq("id", showcaseId)
    .single();

  if (showcaseError || !showcase) {
    return NextResponse.json({ error: "Showcase not found" }, { status: 404 });
  }

  if (!showcase.is_public) {
    return NextResponse.json({ error: "Showcase is not public" }, { status: 403 });
  }

  // 기존 좋아요 확인
  const { data: existing } = await supabase
    .from("avatar_likes")
    .select("id")
    .eq("showcase_id", showcaseId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    // 좋아요 취소
    const { error: deleteError } = await supabase
      .from("avatar_likes")
      .delete()
      .eq("id", existing.id);

    if (deleteError) {
      console.error("Unlike error:", deleteError);
      return NextResponse.json(
        { error: "Failed to unlike" },
        { status: 500 }
      );
    }

    // 새 좋아요 수 반환
    const { count } = await supabase
      .from("avatar_likes")
      .select("*", { count: "exact", head: true })
      .eq("showcase_id", showcaseId);

    return NextResponse.json({ liked: false, count: count || 0 });
  } else {
    // 좋아요 추가
    const { error: insertError } = await supabase
      .from("avatar_likes")
      .insert({
        showcase_id: showcaseId,
        user_id: user.id,
      });

    if (insertError) {
      console.error("Like error:", insertError);
      return NextResponse.json(
        { error: "Failed to like" },
        { status: 500 }
      );
    }

    // 새 좋아요 수 반환
    const { count } = await supabase
      .from("avatar_likes")
      .select("*", { count: "exact", head: true })
      .eq("showcase_id", showcaseId);

    return NextResponse.json({ liked: true, count: count || 0 });
  }
}
