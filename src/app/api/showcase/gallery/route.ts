import { createSupabaseServer } from "@/lib/supabase/server/server";
import { NextRequest, NextResponse } from "next/server";
import { ShowcaseSortOption } from "@/types/showcase";

const PAGE_SIZE = 12;

// GET: 갤러리 목록 (?page, ?sort=latest|popular)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const sort: ShowcaseSortOption = (searchParams.get("sort") as ShowcaseSortOption) || "latest";

  const supabase = await createSupabaseServer();

  // 현재 로그인한 유저 확인 (좋아요 상태 표시용)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const offset = (page - 1) * PAGE_SIZE;

  // 공개된 showcase만 조회
  let query = supabase
    .from("avatar_showcase")
    .select(`
      *,
      avatar_likes(count)
    `, { count: "exact" })
;

  // 정렬
  if (sort === "popular") {
    // 인기순은 like_count로 정렬 (클라이언트에서 처리)
    query = query.order("created_at", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  query = query.range(offset, offset + PAGE_SIZE - 1);

  const { data: showcases, error, count } = await query;

  if (error) {
    console.error("Gallery fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch gallery" },
      { status: 500 }
    );
  }

  // 좋아요 수 및 상태 처리
  const showcasesWithStats = await Promise.all(
    (showcases || []).map(async (showcase: any) => {
      // 현재 유저의 좋아요 상태 확인
      let isLiked = false;
      if (user) {
        const { data: likeData } = await supabase
          .from("avatar_likes")
          .select("id")
          .eq("showcase_id", showcase.id)
          .eq("user_id", user.id)
          .maybeSingle();
        isLiked = !!likeData;
      }

      return {
        ...showcase,
        like_count: showcase.avatar_likes?.[0]?.count || 0,
        is_liked: isLiked,
      };
    })
  );

  // 인기순 정렬
  if (sort === "popular") {
    showcasesWithStats.sort((a, b) => b.like_count - a.like_count);
  }

  const total = count || 0;
  const hasMore = offset + PAGE_SIZE < total;

  return NextResponse.json({
    showcases: showcasesWithStats,
    total,
    page,
    hasMore,
  });
}
