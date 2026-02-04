import { createSupabaseServer } from "@/lib/supabase/server/server";
import { NextRequest, NextResponse } from "next/server";

// GET: 단일 showcase 조회
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabase = await createSupabaseServer();

  const { data: showcase, error } = await supabase
    .from("avatar_showcase")
    .select(`
      *,
      avatar_likes(count)
    `)
    .eq("id", id)
    .single();

  if (error || !showcase) {
    return NextResponse.json(
      { error: "Showcase not found" },
      { status: 404 }
    );
  }

  // 현재 로그인한 유저의 좋아요 상태 확인
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isLiked = false;
  if (user) {
    const { data: likeData } = await supabase
      .from("avatar_likes")
      .select("id")
      .eq("showcase_id", id)
      .eq("user_id", user.id)
      .maybeSingle();
    isLiked = !!likeData;
  }

  return NextResponse.json({
    showcase: {
      ...showcase,
      like_count: showcase.avatar_likes?.[0]?.count || 0,
      is_liked: isLiked,
    },
  });
}

// DELETE: showcase 삭제 (본인만 가능)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabase = await createSupabaseServer();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 본인 소유 확인 후 삭제
  const { error } = await supabase
    .from("avatar_showcase")
    .delete()
    .eq("id", id)
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
