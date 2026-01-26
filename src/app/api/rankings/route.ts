import { getRankings, getRankingsByClass } from "@/lib/supabase/rankings";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const className = searchParams.get("class");
  const limit = parseInt(searchParams.get("limit") || "100");

  try {
    const data = className
      ? await getRankingsByClass(className, limit)
      : await getRankings();

    return NextResponse.json({ rankings: data }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/rankings:", error);
    return NextResponse.json(
      { error: "Failed to fetch rankings" },
      { status: 500 }
    );
  }
}
